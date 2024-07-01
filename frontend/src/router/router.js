import { createRouter, createWebHistory } from "vue-router";
import login from "../components/login.vue";
import userRegister from "../components/userRegister.vue";
import work from "../components/work.vue";
import project from "../components/project.vue";
import todo from "../components/todo.vue";
import wiki from "../components/wiki.vue";
import manual from "../components/manual.vue";
import test from "../components/test.vue";

const routes = [
  {
    path: "/login",
    name: "login",
    component: login,
  },
  {
    path: "/userRegister",
    name: "userRegister",
    component: userRegister,
  },
  {
    path: "/work",
    name: "work",
    component: work,
  },
  {
    path: "/",
    name: "project",
    component: project,
  },
  {
    path: "/todo",
    name: "todo",
    component: todo,
  },
  {
    path: "/wiki",
    name: "wiki",
    component: wiki,
  },
  {
    path: "/manual",
    name: "manual",
    component: manual,
  },
  {
    path: "/test",
    name: "test",
    component: test,
  },
];

const router = createRouter({
  history: createWebHistory("TeamSync"),
  routes,
});

export default router;
