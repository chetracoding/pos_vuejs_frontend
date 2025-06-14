import { createRouter, createWebHistory } from "vue-router";
import { loggedIn } from "@/common/auth/logged.js";

const routes = [
  {
    path: "/login",
    name: "Login",
    meta: { auth: true },
    component: () => import("@/views/LoginView"),
  },
  {
    path: "/store",
    name: "StoreView",
    meta: { isSecure: true, auth: false },
    component: () => import("@/views/StoreView"),
  },
  {
    path: "/manage_account",
    name: "ManageAccountView",
    meta: { isSecure: true, auth: false },
    component: () => import("@/views/ManageAccountView"),
  },
  {
    path: "/change_password",
    name: "ChangePasswordView",
    meta: { isSecure: true, auth: false },
    component: () => import("@/views/ChangePasswordView"),
  },
  {
    path: "/recover_password",
    name: "RecoverPasswordView",
    meta: { auth: true },
    component: () => import("@/views/RecoverPasswordView"),
  },
  {
    path: "/reset_password/:token",
    name: "ResetPasswordView",
    component: () => import("@/views/ResetPasswordView"),
    props: true,
  },
  {
    path: "/:pathMatch(.*)*",
    name: "404",
    component: () => import("@/views/404/PageNotFoundView"),
  },

  // product owner ==============================================
  {
    path: "/",
    name: "HomeView",
    meta: { isSecure: true, defaultPage: true, role: "restaurant_owner" },
    component: () => import("@/views/owner/HomeView"),
  },
  {
    path: "/category",
    name: "CategoryView",
    meta: { isSecure: true, role: "restaurant_owner" },
    component: () => import("@/views/owner/CategoryView"),
  },
  {
    path: "/product",
    name: "ProductView",
    meta: { isSecure: true, role: "restaurant_owner" },
    component: () => import("@/views/owner/ProductView"),
  },
  {
    path: "/table",
    name: "TableView",
    meta: { isSecure: true, role: "restaurant_owner" },
    component: () => import("@/views/owner/TableView"),
  },
  {
    path: "/staff",
    name: "StaffView",
    meta: { isSecure: true, role: "restaurant_owner" },
    component: () => import("@/views/owner/StaffView"),
  },
  {
    path: "/money",
    name: "MoneyView",
    meta: { isSecure: true, role: "restaurant_owner" },
    component: () => import("@/views/owner/MoneyView"),
  },
  {
    path: "/sale",
    name: "/ProductReportView",
    meta: { isSecure: true, role: "restaurant_owner" },
    component: () => import("@/views/owner/ProductReportView"),
  },

  // waiter =====================================================
  {
    path: "/waiter",
    name: "WaiterView",
    meta: { isSecure: true, defaultPage: true, role: "waiter" },
    component: () => import("@/views/waiter/WaiterView"),
  },
  {
    path: "/order-details",
    name: "OrderDetailsView",
    meta: { isSecure: true, role: "waiter" },
    component: () => import("@/views/waiter/OrderDetailsView"),
  },

  // Chef =======================================================
  {
    path: "/chef",
    name: "ChefView",
    meta: { isSecure: true, defaultPage: true, role: "chef" },
    component: () => import("@/views/chef/ChefView"),
  },

  // Cashier =======================================================
  {
    path: "/cashier",
    name: "OrdersView",
    meta: { isSecure: true, defaultPage: true, role: "cashier" },
    component: () => import("@/views/cashier/OrdersView"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  await loggedIn(to, from, next, router);
});

export default router;
