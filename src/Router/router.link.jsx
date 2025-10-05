import React from "react";
const routes = all_routes;
import { Route } from "react-router-dom";
import ProductList from "../feature-module/inventory/productlist";
import Dashboard from "../feature-module/dashboard/Dashboard";
import AddProduct from "../feature-module/inventory/addproduct";
import EditProduct from "../feature-module/inventory/editproduct";
import Customers from "../feature-module/people/customers";
import Suppliers from "../feature-module/people/suppliers";
import SalesList from "../feature-module/sales/saleslist";
import Signin from "../feature-module/pages/login/signin";
import SigninTwo from "../feature-module/pages/login/signinTwo";
import RegisterTwo from "../feature-module/pages/register/registerTwo";
import Register from "../feature-module/pages/register/register";
import RegisterThree from "../feature-module/pages/register/registerThree";
import Error404 from "../feature-module/pages/errorpages/error404";
import { all_routes } from "./all_routes";
import ManageSale from "../feature-module/sales/ManageSale";
export const publicRoutes = [
  {
    id: 1,
    path: routes.dashboard,
    name: "home",
    element: <Dashboard />,
    route: Route,
  },
  {
    id: 2,
    path: routes.productlist,
    name: "products",
    element: <ProductList />,
    route: Route,
  },
  {
    id: 3,
    path: routes.addproduct,
    name: "products",
    element: <AddProduct />,
    route: Route,
  },
  {
    id: 65,
    path: routes.editproduct,
    name: "editproduct",
    element: <EditProduct />,
    route: Route,
  },
  
  {
    id: 84,
    path: routes.customers,
    name: "customers",
    element: <Customers />,
    route: Route,
  },
  {
    id: 85,
    path: routes.suppliers,
    name: "suppliers",
    element: <Suppliers />,
    route: Route,
  },
  
  {
    id: 102,
    path: routes.saleslist,
    name: "saleslist",
    element: <SalesList />,
    route: Route,
  },
  {
    id: 102,
    path: routes.manageSales,
    name: "saleslist",
    element: <ManageSale />,
    route: Route,
  },
  {
    id: 102,
    path: routes.manageSalesedit,
    name: "saleslist",
    element: <ManageSale />,
    route: Route,
  },
  
  

];
export const pagesRoute = [
  {
    id: 1,
    path: routes.signin,
    name: "signin",
    element: <SigninTwo />,
    route: Route,
  },
  {
    id: 2,
    path: routes.signintwo,
    name: "signintwo",
    element: <SigninTwo />,
    route: Route,
  },
  {
    id: 3,
    path: routes.signinthree,
    name: "signinthree",
    element: <Signin />,
    route: Route,
  },
  {
    id: 4,
    path: routes.register,
    name: "register",
    element: <Register />,
    route: Route,
  },
  {
    id: 5,
    path: routes.registerTwo,
    name: "registerTwo",
    element: <RegisterTwo />,
    route: Route,
  },
  {
    id: 6,
    path: routes.registerThree,
    name: "registerThree",
    element: <RegisterThree />,
    route: Route,
  },
  {
    id: 18,
    path: routes.error404,
    name: "error404",
    element: <Error404 />,
    route: Route,
  },
  
  
];
