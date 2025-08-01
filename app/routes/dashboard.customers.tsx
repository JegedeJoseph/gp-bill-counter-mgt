import { Link, useLoaderData, useFetcher } from "@remix-run/react";
import { del, PlusIcon, editIcon } from "../icons";
import { AppDialog, useDialog } from "~/dialog";
import { useState } from "react";
import { ClientOnly } from "~/utils/client-only";
import { Table, Input, Space, SearchOutlined } from "~/utils/antd-imports";
import type { ColumnsType } from "antd/es/table";
import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";

export const loader: LoaderFunction = async () => {
  const { connectToDatabase } = await import("~/utils/db.server");
  const { Customer } = await import("~/models/Customer");
  await connectToDatabase();
  const customers = await Customer.find({}).lean();
  return json(customers);
};

export const action: ActionFunction = async ({ request }) => {
  if (request.method.toLowerCase() === "delete") {
    const { connectToDatabase } = await import("~/utils/db.server");
    const { Customer } = await import("~/models/Customer");
    await connectToDatabase();
    const body = await request.json();
    await Customer.findByIdAndDelete(body._id);
    return json({ success: true });
  }
  return json({ error: "Method not allowed" }, { status: 405 });
};

export default function Customers() {
  const customers = useLoaderData<any[]>();
  const [searchTerm, setSearchTerm] = useState("");
  const { dialogState, openDialog, closeDialog } = useDialog();
  const fetcher = useFetcher();

  const onEdit = (customer: any) => {
    // Implement edit navigation or modal as needed
  };

  const onDelete = (customer: any) => {
    openDialog({
      title: "Delete Customer",
      message: `Are you sure you want to delete ${customer.contactPerson}? This action cannot be undone.`,
      onConfirm: async () => {
        fetcher.submit({ _id: customer._id }, { method: "delete" });
        closeDialog();
      },
      onCancel: closeDialog,
    });
  };

  // Filter customers based on search term
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.mobile.includes(searchTerm) ||
      customer.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns: ColumnsType<any> = [
    {
      title: "S/N",
      key: "index",
      width: "4%",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Customer Name",
      dataIndex: "contactPerson",
      key: "contactPerson",
      width: "18%",
    },
    {
      title: "Mobile Number",
      dataIndex: "mobile",
      key: "mobile",
      width: "13%",
      render: (mobile: string) => (
        <Link to={`../customerdetails/${mobile}`}>
          <u>{mobile}</u>
        </Link>
      ),
    },
    {
      title: "Email Address",
      key: "email",
      width: "20%",
      render: (_: any, record: any) => record.email || record.username,
    },
    {
      title: "Social Media Username",
      dataIndex: "socialMedia",
      key: "socialMedia",
      width: "15%",
    },
    {
      title: "Date Joined",
      dataIndex: "dateJoined",
      key: "dateJoined",
      width: "9%",
    },
    {
      title: "Menu Type",
      dataIndex: "cateringType",
      key: "cateringType",
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: any) => (
        <Space size="middle">
          <span
            className="text-blue-400 cursor-pointer hover:text-blue-600 active:text-blue-800"
            onClick={() => onEdit(record)}
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

  // Fallback table for server-side rendering
  const fallbackTable = (
    <div className="mt-5">
      <table className="table-fixed w-full mt-8 text-center shadow-xl bg-white">
        <thead>
          <tr className="bg-slate-100">
            <th className="border border-slate-400 w-[4%]">S/N</th>
            <th className="border border-slate-400 w-[8%]">CustomerID</th>
            <th className="border border-slate-400 w-[18%]">CustomerName</th>
            <th className="border border-slate-400 w-[13%]">Mobile Number</th>
            <th className="border border-slate-400 w-[20%]">
              Email Address Or Username
            </th>
            <th className="border border-slate-400 w-[15%]">
              Social media Handle
            </th>
            <th className="border border-slate-400 w-[9%]">Date Joined</th>
            <th className="border border-slate-400">Menu Type</th>
            <th className="border border-slate-400">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredCustomers.slice(0, 10).map((customer, index) => (
            <tr className="h-10" key={customer.id}>
              <td className="border border-slate-400">{index + 1}</td>
              <td className="border border-slate-400">
                {String(customer.id).padStart(6, "0")}
              </td>
              <td className="border border-slate-400">
                {customer.contactPerson}
              </td>
              <td className="border border-slate-400">
                <Link to={`../customerdetails/${customer.mobile}`}>
                  <u>{customer.mobile}</u>
                </Link>
              </td>
              <td className="border border-slate-400">{customer.email}</td>
              <td className="border border-slate-400">
                {customer.socialMedia}
              </td>
              <td className="border border-slate-400">{customer.dateJoined}</td>
              <td className="border border-slate-400">
                {customer.cateringType}
              </td>
              <td className="border border-slate-400">
                <div className="flex justify-around items-center">
                  <span className="text-blue-400 cursor-pointer">
                    {editIcon}
                  </span>
                  <span className="text-red-400 cursor-pointer">{del}</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <section className="container h-[100%] bg-slate-100 p-5">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-4xl text-gray-900 tracking-tighter">Customers</h1>
        <div className="flex items-center">
          <ClientOnly
            fallback={
              <input
                type="text"
                className="ml-4 bg-slate-200 h-8 p-2 border"
                placeholder="Search by name or mobile"
              />
            }
          >
            <Input
              placeholder="Search by name or mobile"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              prefix={<SearchOutlined />}
              style={{ width: 250, marginRight: 16 }}
            />
          </ClientOnly>

          <Link
            to="../newcustomer"
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <span className="mr-1">{PlusIcon}</span>
            <span>
              <u>New</u>
            </span>
          </Link>
        </div>
      </div>

      <ClientOnly fallback={fallbackTable}>
        <Table
          columns={columns}
          dataSource={filteredCustomers}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
          bordered
        />
      </ClientOnly>

      {/* Render the dialog with our state */}
      <AppDialog
        isOpen={dialogState.isOpen}
        title={dialogState.title}
        message={dialogState.message}
        onConfirm={dialogState.onConfirm}
        onCancel={dialogState.onCancel}
      />
    </section>
  );
}
