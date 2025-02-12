'use client';

import { CustomerProfileForm } from '@/components/CustomerProfileForm';
import { CustomerProfileList } from '@/components/CustomerProfileList';
import { useEffect, useState } from 'react';

type CustomerProfile = {
  id: number;
  customerName: string;
  companyName: string;
  createdAt: string;
};

export default function CustomerProfilePage() {
  const [customers, setCustomers] = useState<CustomerProfile[]>([]);
  const [editingCustomer, setEditingCustomer] = useState<CustomerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load customers from localStorage on component mount
    const storedCustomers = localStorage.getItem('customers');
    if (storedCustomers) {
      setCustomers(JSON.parse(storedCustomers));
    }
    setIsLoading(false);
  }, []);

  // Save customers to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('customers', JSON.stringify(customers));
  }, [customers]);

  const handleSubmit = async (data: Omit<CustomerProfile, 'id' | 'createdAt'>) => {
    try {
      if (editingCustomer) {
        // Update existing customer
        setCustomers(prevCustomers =>
          prevCustomers.map(customer =>
            customer.id === editingCustomer.id
              ? {
                  ...customer,
                  ...data,
                  updatedAt: new Date().toISOString(),
                }
              : customer,
          ),
        );
      } else {
        // Create new customer
        const newCustomer: CustomerProfile = {
          id: Date.now(),
          ...data,
          createdAt: new Date().toISOString(),
        };
        setCustomers(prevCustomers => [...prevCustomers, newCustomer]);
      }
      setEditingCustomer(null);
    } catch (error) {
      console.error('Failed to save customer:', error);
    }
  };

  const handleEdit = (customer: CustomerProfile) => {
    // Explicitly set the form data when editing
    setEditingCustomer({
      id: customer.id,
      customerName: customer.customerName,
      companyName: customer.companyName,
      createdAt: customer.createdAt,
    });
  };

  const handleDelete = async (id: number) => {
    try {
      setCustomers(prevCustomers =>
        prevCustomers.filter(customer => customer.id !== id),
      );
    } catch (error) {
      console.error('Failed to delete customer:', error);
    }
  };

  const handleCancel = () => {
    setEditingCustomer(null);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mx-auto max-w-7xl py-8">
      <div className="px-4 sm:px-6 lg:px-8">
        <h1 className="mb-6 text-2xl font-bold">
          {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
        </h1>

        <CustomerProfileForm
          key={editingCustomer?.id || 'new'} // Add key to force form reset
          initialData={editingCustomer || undefined}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />

        <CustomerProfileList
          customers={customers}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
