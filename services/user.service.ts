import service from "./axiosConfig";

const userService = {
  getAll: (data: Object) => {
    return service.get("/users", { data });
  },
  update: (id: string, data: Object) => {
    return service.put(`/users/${id}`, data);
  },
};
export default userService;
