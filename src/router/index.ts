import { createWebHistory, createRouter } from "vue-router";
import { CompaniesRouter } from "../view/companies/router/CompaniesRouter";
import { ProfileRouter } from "../view/profile/router/ProfileRouter";

const routes = [
  ...CompaniesRouter.options.routes,
  ...ProfileRouter.options.routes,
  {
    path: "/",
    name: "Home",
    redirect: "/dashboard",
    meta: {
      layout: "Admin",
      requiresAuth: true,
    },
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../modules/auth/LoginPages.vue"),
    meta: {
      layout: "Empty",
    },
  },
  {
    path: "/sign",
    name: "Sign",
    component: () => import("../modules/auth/SignPages.vue"),
    meta: {
      layout: "Empty",
    },
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: () => import("../view/Dashboard.vue"),
    meta: {
      layout: "Admin",
      requiresAuth: true,
      title: "Dashboard",
    },
  },
  {
    path: "/staff",
    name: "Staff",
    component: () => import("../view/staff/index.vue"),
    meta: {
      layout: "Admin",
      requiresAuth: true,
      title: "Dashboard",
      role: 'admin'
    },
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});


const getUserData = () => {
  const userData = localStorage.getItem("user");
  if (userData) {
    const parsedUser = JSON.parse(userData);
    return {
      token: parsedUser?.auth?.jwt_token || null,
    };
  }
  return { token: null };
};


router.beforeEach((to, _from, next) => {
  const { token } = getUserData();
  const isAuthenticated = !!token;


  if (to.matched.some((record) => record.meta.requiresAuth) && !isAuthenticated) {
    next({ path: "/login" });
  } else if (to.path === "/login" && isAuthenticated) {
    // Если пользователь уже авторизован, перенаправляем на /dashboard
    next({ path: "/dashboard" });
  } else {
    // Все условия выполнены, разрешаем переход
    next();
  }
});
