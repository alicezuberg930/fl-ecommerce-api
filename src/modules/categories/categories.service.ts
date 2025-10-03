import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { CreateCategoryData } from './dto/create-category.dto'
import { UpdateCategoryData } from './dto/update-category.dto'
import { Category, CategoryDocument } from './shemas/category.schema'
import { FileService } from '../files/file.service'

@Injectable()
export class CategoriesService {
  constructor(@InjectModel(Category.name) private categoryModel: Model<CategoryDocument>, private fileService: FileService) { }

  async create(data: CreateCategoryData, file: Express.Multer.File) {
    try {
      let logo = null
      if (file) logo = await this.fileService.upload(file, 'categories')
      let { parentCategoryId } = data
      if (parentCategoryId) {
        const parentCategory = await this.categoryModel.findById(parentCategoryId)
        if (!parentCategory) throw new NotFoundException('Parent category not found')
        const childCategory = await this.categoryModel.create({ ...data, logo, parentCategoryId: new Types.ObjectId(parentCategoryId) })
        parentCategory.subCategories.push(childCategory._id)
        await parentCategory.save()
        return childCategory
      }
      const category = await this.categoryModel.create({ ...data, logo })
      return category
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  private async populateChildren(id: Types.ObjectId) {
    const populatedCategory = await this.categoryModel.findById(id).populate('subCategories')
    let subCategories = await Promise.all(populatedCategory.subCategories.map(category => this.populateChildren(category._id)))
    return { ...populatedCategory.toObject(), subCategories }
  }

  async findAll() {
    try {
      const parentCategories = await this.categoryModel.find({ parentCategoryId: null })
      const allCategories = await Promise.all(parentCategories.map(category => this.populateChildren(category._id)))
      return allCategories
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async findOne(id: string) {
    try {
      const category = await this.categoryModel.findById(id).populate('subCategories')
      if (!category) throw new NotFoundException('Category not found')
      const subCategories = await Promise.all(category.subCategories.map(category => this.populateChildren(category)))
      return { ...category.toObject(), subCategories }
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  private async deleteChildren(parentCategoryId: Types.ObjectId) {
    const children = await this.categoryModel.find({ parentCategoryId })
    for (const child of children) {
      await this.deleteChildren(child._id)
      await this.fileService.delete(child.logo)
      await this.categoryModel.findByIdAndDelete(child._id)
    }
  }

  async delete(id: string) {
    try {
      const category = await this.categoryModel.findById(id)
      if (!category) throw new NotFoundException('Category not found')
      if (category.parentCategoryId) {
        await this.categoryModel.findByIdAndUpdate(category.parentCategoryId, { $pull: { subCategories: category._id } })
      }
      await this.deleteChildren(category._id)
      await this.fileService.delete(category.logo)
      await this.categoryModel.findByIdAndDelete(id)
      return category
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async update(id: string, categoryData: UpdateCategoryData, file: Express.Multer.File) {
    const { parentCategoryId } = categoryData
    try {
      const category = await this.categoryModel.findById(id);
      if (!category) throw new NotFoundException('Category not found');
      // check if a parent category is in request body
      if (parentCategoryId) {
        // get the selected parent category
        const parentCategory = await this.categoryModel.findById(parentCategoryId)
        // check if the selected parent category exists
        if (!parentCategory) throw new NotFoundException('Parent category not found')
        // Check if the parent category is different from the current parent category
        if (!category.parentCategoryId.equals(parentCategory._id)) {
          // Add to the new parent's subcategories
          await parentCategory.updateOne({ $push: { subCategories: category._id } })
          // Remove from the old parent's subcategories if it exists
          if (category.parentCategoryId) {
            await this.categoryModel.findByIdAndUpdate(category.parentCategoryId, { $pull: { subCategories: category._id } })
          }
        }
      }
      let logo = null
      if (file) {
        logo = await this.fileService.upload(file, 'categories')
        await this.fileService.delete(category.logo)
      }
      logo = logo != null ? logo : category.logo
      await category.updateOne({ ...categoryData, parentCategoryId, logo })
      return category
    } catch (error) {
      throw new BadRequestException(error)
    }
  }
}