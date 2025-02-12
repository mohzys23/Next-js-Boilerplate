import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const customerProfileSchema = z.object({
  customerName: z.string().min(1, 'Customer name is required'),
  companyName: z.string().min(1, 'Company name is required'),
});

type CustomerProfileFormData = z.infer<typeof customerProfileSchema>;

type CustomerProfileFormProps = {
  initialData?: {
    id?: number;
    customerName: string;
    companyName: string;
  };
  onSubmit: (data: CustomerProfileFormData) => Promise<void>;
  onCancel?: () => void;
};

export const CustomerProfileForm = ({
  initialData,
  onSubmit,
  onCancel,
}: CustomerProfileFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CustomerProfileFormData>({
    resolver: zodResolver(customerProfileSchema),
    defaultValues: initialData || {
      customerName: '',
      companyName: '',
    },
  });

  // Reset form when initialData changes
  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const onSubmitWrapper = async (data: CustomerProfileFormData) => {
    await onSubmit(data);
    if (!initialData) {
      // Only reset if we're adding a new customer (not editing)
      reset({
        customerName: '',
        companyName: '',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitWrapper)} className="space-y-4 mb-8">
      <div>
        <label
          htmlFor="customerName"
          className="block text-sm font-medium text-gray-700"
        >
          Customer Name
        </label>
        <input
          {...register('customerName')}
          type="text"
          id="customerName"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        {errors.customerName && (
          <p className="mt-1 text-sm text-red-600">
            {errors.customerName.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="companyName"
          className="block text-sm font-medium text-gray-700"
        >
          Company Name
        </label>
        <input
          {...register('companyName')}
          type="text"
          id="companyName"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        {errors.companyName && (
          <p className="mt-1 text-sm text-red-600">
            {errors.companyName.message}
          </p>
        )}
      </div>

      <div className="flex justify-end space-x-3">
        {onCancel && (
          <button
            type="button"
            onClick={() => {
              onCancel();
              reset({
                customerName: '',
                companyName: '',
              });
            }}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : initialData ? 'Update' : 'Save'}
        </button>
      </div>
    </form>
  );
};
