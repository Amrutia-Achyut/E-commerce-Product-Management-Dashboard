'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { productSchema, ProductFormData } from '@/lib/validations/productSchema';
import ImageUpload from './ImageUpload';
import './forms.css';

interface ProductFormProps {
  initialData?: Partial<ProductFormData> & { _id?: string };
  isEdit?: boolean;
}

export default function ProductForm({ initialData, isEdit = false }: ProductFormProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [images, setImages] = useState<string[]>(() => {
    if (initialData?.images && Array.isArray(initialData.images)) {
      return initialData.images.filter((img): img is string => typeof img === 'string');
    }
    return [];
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ProductFormData>({
    resolver: yupResolver(productSchema),
    defaultValues: initialData || {
      name: '',
      description: '',
      price: 0,
      stock: 0,
      category: '',
      sku: '',
      status: 'active',
    },
  });

  const watchedValues = watch();

  const steps = [
    {
      number: 1,
      title: 'Basic Information',
      fields: ['name', 'description', 'category'],
    },
    {
      number: 2,
      title: 'Pricing & Inventory',
      fields: ['price', 'stock', 'sku'],
    },
    {
      number: 3,
      title: 'Images & Status',
      fields: ['images', 'status'],
    },
  ];

  const isStepValid = (stepNumber: number) => {
    const step = steps[stepNumber - 1];
    return step.fields.every((field) => {
      if (field === 'images') {
        return images.length > 0;
      }
      const value = watchedValues[field as keyof ProductFormData];
      return value !== undefined && value !== '' && value !== 0;
    });
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    if (images.length === 0) {
      setError('Please upload at least one product image');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const productData = {
        ...data,
        images,
      };

      if (isEdit && initialData?._id) {
        await axios.put(`/api/products/${initialData._id}`, productData);
      } else {
        await axios.post('/api/products', productData);
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save product');
    } finally {
      setIsSubmitting(false);
    }
  };
  // 👇 ADD THIS HERE (above return)
  const crossStepErrors = steps
    .filter(step => step.number !== currentStep)
    .flatMap(step =>
      step.fields
        .filter(field => errors[field as keyof ProductFormData])
        .map(field => ({
          field,
          step: step.number,
          message: errors[field as keyof ProductFormData]?.message as string,
        }))
    );


  return (
    <div className="form-container">
      <div className="form-header">
        <h1>{isEdit ? 'Edit Product' : 'Create New Product'}</h1>
        <p>Fill in the details to {isEdit ? 'update' : 'add'} a product</p>
      </div>

      <div className="form-steps">
        {steps.map((step) => (
          <div
            key={step.number}
            className={`form-step 
              ${currentStep === step.number ? 'active' : ''} 
              ${currentStep > step.number ? 'completed' : ''}`}
          >
            <div className="step-number">{step.number}</div>
            <div className="step-title">{step.title}</div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="product-form">
        {error && <div className="form-error">{error}</div>}

        {currentStep === 1 && (
          <div className="form-step-content">
            <h2>Basic Information</h2>
            <div className="form-group">
              <label htmlFor="name">Product Name *</label>
              <input
                id="name"
                type="text"
                {...register('name')}
                placeholder="Enter product name"
              />
              {errors.name && <span className="field-error">{errors.name.message}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                {...register('description')}
                rows={5}
                placeholder="Enter product description"
              />
              {errors.description && (
                <span className="field-error">{errors.description.message}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select id="category" {...register('category')}>
                <option value="">Select a category</option>
                <option value="Electronics">Electronics</option>
                <option value="Clothing">Clothing</option>
                <option value="Home & Garden">Home & Garden</option>
                <option value="Sports">Sports</option>
                <option value="Books">Books</option>
                <option value="Toys">Toys</option>
                <option value="Food & Beverages">Food & Beverages</option>
                <option value="Health & Beauty">Health & Beauty</option>
                <option value="Other">Other</option>
              </select>
              {errors.category && (
                <span className="field-error">{errors.category.message}</span>
              )}
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="form-step-content">
            <h2>Pricing & Inventory</h2>
            <div className="form-group">
              <label htmlFor="price">Price *</label>
              <input
                id="price"
                type="number"
                step="0.01"
                {...register('price', { valueAsNumber: true })}
                placeholder="0.00"
              />
              {errors.price && <span className="field-error">{errors.price.message}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="stock">Stock Quantity *</label>
              <input
                id="stock"
                type="number"
                {...register('stock', { valueAsNumber: true })}
                placeholder="0"
              />
              {errors.stock && <span className="field-error">{errors.stock.message}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="sku">SKU (Stock Keeping Unit) *</label>
              <input
                id="sku"
                type="text"
                {...register('sku')}
                placeholder="e.g., PROD-001"
              />
              {errors.sku && <span className="field-error">{errors.sku.message}</span>}
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="form-step-content">
            {crossStepErrors.length > 0 && (
              <div className="form-error-summary">
                <h3>Please fix the following before submitting:</h3>
                <ul>
                  {crossStepErrors.map((err) => (
                    <li
                      key={err.field}
                      onClick={() => setCurrentStep(err.step)}
                      className="error-link"
                    >
                      Step {err.step}: {err.message}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <h2>Images & Status</h2>
            <div className="form-group">
              <label>Product Images *</label>
              <ImageUpload images={images} setImages={setImages} />
              {images.length === 0 && (
                <span className="field-error">At least one image is required</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="status">Status *</label>
              <select id="status" {...register('status')}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              {errors.status && (
                <span className="field-error">{errors.status.message}</span>
              )}
            </div>
          </div>
        )}

        <div className="form-actions">
          {currentStep > 1 && (
            <button type="button" onClick={handlePrevious} className="btn btn-secondary">
              Previous
            </button>
          )}
          {currentStep < steps.length ? (
            <button
              type="button"
              onClick={handleNext}
              className="btn btn-primary"
              disabled={!isStepValid(currentStep)}
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting || images.length === 0}
            >
              {isSubmitting ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

