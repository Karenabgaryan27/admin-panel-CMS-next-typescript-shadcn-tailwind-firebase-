"use client";

import React from "react";
import { BreadcrumbDemo, TableDemo } from "@/components/index";

const breadcrumbItems = [
  {
    href: "/",
    label: "Home",
  },
  {
    label: "Pages",
  },
];

const sections = [
  {
    invoice: '1',
    name: 'Header',
    href: '/admin/pages/header'
  },
  {
    invoice: '2',
    name: 'About',
    href: '/admin/pages/about'
  },
  {
    invoice: '3',
    name: 'Services',
    href: '/admin/pages/services'
  },

  {
    invoice: '4',
    name: 'Contact',
    href: '/admin/pages/contact'
  },
  {
    invoice: '5',
    name: 'Footer',
    href: '/admin/pages/footer',
    isDisabled: true
  },

]

const Pages = () => {
  return (
    <main className="pages-page py-5 px-10 pb-[150px]">
      <h2 className="text-2xl mb-3">Pages</h2>
      <BreadcrumbDemo items={breadcrumbItems} />
      <br />
      <br />
      <br />
      <h2 className="text-1xl font-bold mb-3">Home Page</h2>
      <TableDemo invoices={sections}/>
    </main>
  );
};

export default Pages;
