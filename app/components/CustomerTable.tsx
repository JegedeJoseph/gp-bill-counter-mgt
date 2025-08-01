import { Table, Space } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Link } from "@remix-run/react";
import { del, editIcon } from "~/icons";

interface Customer {
  id: number;
  contactPerson: string;
  mobile: string;
  email?: string;
  username?: string;
  socialMedia: string;
  dateJoined: string;
  cateringType: string;
  companyName: string;
}

interface CustomerTableProps {
  customers: Customer[];
  onEdit: (mobile: string) => void;
  onDelete: (customer: Customer) => void;
}

export default function CustomerTable({ customers, onEdit, onDelete }: CustomerTableProps) {
  const columns: ColumnsType<Customer> = [
    {
      title: 'S/N',
      key: 'index',
      width: '4%',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Customer ID',
      dataIndex: 'id',
      key: 'id',
      width: '8%',
      render: (id) => String(id).padStart(6, "0"),
    },
    {
      title: 'Customer Name',
      dataIndex: 'contactPerson',
      key: 'contactPerson',
      width: '18%',
    },
    {
      title: 'Mobile Number',
      dataIndex: 'mobile',
      key: 'mobile',
      width: '13%',
      render: (mobile) => (
        <Link to={`../customerdetails/${mobile}`}>
          <u>{mobile}</u>
        </Link>
      ),
    },
    {
      title: 'Email Address Or Username',
      key: 'emailOrUsername',
      width: '20%',
      render: (_, record) => record.email || record.username,
    },
    {
      title: 'Social Media Username',
      dataIndex: 'socialMedia',
      key: 'socialMedia',
      width: '15%',
    },
    {
      title: 'Date Joined',
      dataIndex: 'dateJoined',
      key: 'dateJoined',
      width: '9%',
    },
    {
      title: 'Menu Type',
      dataIndex: 'cateringType',
      key: 'cateringType',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <span
            className="text-blue-400 cursor-pointer hover:text-blue-600 active:text-blue-800"
            onClick={() => onEdit(record.mobile)}
            title="Edit customer"
          >
            {editIcon}
          </span>
          <span 
            className="text-red-400 cursor-pointer hover:text-red-600 active:text-red-800"
            onClick={() => onDelete(record)}
            title="Delete customer"
          >
            {del}
          </span>
        </Space>
      ),
    },
  ];

  return (
    <Table 
      columns={columns} 
      dataSource={customers} 
      rowKey="id"
      pagination={{ pageSize: 10 }}
      bordered
    />
  );
}