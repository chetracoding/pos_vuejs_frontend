import { createRouter, createWebHistory } from "vue-router";
import { loggedIn } from "@/common/auth/logged";

const routes = [
  {
    path: "/login",
    name: "login",
    meta: { auth: true },
    component: () => import("@/views/LoginView"),
  },
  {
    path: "/store",
    name: "store",
    meta: { isSecure: true, auth: false },
    component: () => import("@/views/StoreView"),
  },
  {
    path: "/manage_account",
    name: "manage_account",
    meta: { isSecure: true, auth: false },
    component: () => import("@/views/ManageAccountView"),
  },
  {
    path: "/change_password",
    name: "change_password",
    meta: { isSecure: true, auth: false },
    component: () => import("@/views/ChangePasswordView"),
  },
  {
    path: "/recover_password",
    name: "recover_password",
    meta: { auth: true },
    component: () => import("@/views/RecoverPasswordView"),
  },
  {
    path: "/reset_password/:token",
    name: "reset_password",
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
    name: "home",
    meta: { isSecure: true, defaultPage: true, role: "restaurant_owner" },
    component: () => import("@/views/owner/HomeView"),
  },
  {
    path: "/category",
    name: "category",
    meta: { isSecure: true, role: "restaurant_owner" },
    component: () => import("@/views/owner/CategoryView"),
  },
  {
    path: "/product",
    name: "product",
    meta: { isSecure: true, role: "restaurant_owner" },
    component: () => import("@/views/owner/ProductView"),
  },
  {
    path: "/table",
    name: "table",
    meta: { isSecure: true, role: "restaurant_owner" },
    component: () => import("@/views/owner/TableView"),
  },
  {
    path: "/staff",
    name: "staff",
    meta: { isSecure: true, role: "restaurant_owner" },
    component: () => import("@/views/owner/StaffView"),
  },
  {
    path: "/money",
    name: "money",
    meta: { isSecure: true, role: "restaurant_owner" },
    component: () => import("@/views/owner/MoneyView"),
  },
  {
    path: "/sale",
    name: "/sale",
    meta: { isSecure: true, role: "restaurant_owner" },
    component: () => import("@/views/owner/ProductReportView"),
  },
  // waiter =====================================================
  {
    path: "/waiter",
    name: "waiter",
    meta: { isSecure: true, defaultPage: true, role: "waiter" },
    component: () => import("@/views/waiter/WaiterView"),
  },
  {
    path: "/order-details",
    name: "order-details",
    meta: { isSecure: true, role: "waiter" },
    component: () => import("@/views/waiter/OrderDetailsView"),
  },
  // Chef =======================================================
  {
    path: "/chef",
    name: "/chef",
    meta: { isSecure: true, defaultPage: true, role: "chef" },
    component: () => import("@/views/chef/ChefView"),
  },
  // Cashier =======================================================
  {
    path: "/cashier",
    name: "/cashier",
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
