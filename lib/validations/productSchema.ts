import * as yup from 'yup';

export const productSchema = yup.object().shape({
  name: yup
    .string()
    .required('Product name is required')
    .max(200, 'Product name cannot exceed 200 characters')
    .trim(),
  description: yup
    .string()
    .required('Product description is required')
    .min(10, 'Description must be at least 10 characters')
    .trim(),
  price: yup
    .number()
    .required('Product price is required')
    .positive('Price must be a positive number')
    .typeError('Price must be a valid number'),
  stock: yup
    .number()
    .required('Stock quantity is required')
    .integer('Stock must be a whole number')
    .min(0, 'Stock cannot be negative')
    .typeError('Stock must be a valid number'),
  category: yup
    .string()
    .required('Product category is required')
    .trim(),
  sku: yup
    .string()
    .required('SKU is required')
    .matches(/^[A-Z0-9-]+$/, 'SKU must contain only uppercase letters, numbers, and hyphens')
    .trim(),
  status: yup
    .string()
    .oneOf(['active', 'inactive'], 'Status must be either active or inactive')
    .required('Status is required'),
  images: yup
    .array()
    .of(yup.string().url('Each image must be a valid URL'))
    .min(1, 'At least one product image is required'),
});

export type ProductFormData = yup.InferType<typeof productSchema>;

