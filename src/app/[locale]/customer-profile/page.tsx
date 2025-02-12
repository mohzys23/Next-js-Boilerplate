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
              ? { ...customer, ...data }
              : customer,
          ),
        );
      } else {
        // Create new customer
        const newCustomer: CustomerProfile = {
          id: Date.now(), // Use timestamp as ID
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

  const handleDelete = async (id: number) => {
    try {
      setCustomers(prevCustomers =>
        prevCustomers.filter(customer => customer.id !== id),
      );
    } catch (error) {
      console.error('Failed to delete customer:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mx-auto max-w-7xl py-8">
      <div className="px-4 sm:px-6 lg:px-8">
        <h1 className="mb-6 text-2xl font-bold">Customer Profiles</h1>

        <CustomerProfileForm
          initialData={editingCustomer || undefined}
          onSubmit={handleSubmit}
          onCancel={editingCustomer ? () => setEditingCustomer(null) : undefined}
        />

        <CustomerProfileList
          customers={customers}
          onEdit={setEditingCustomer}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
