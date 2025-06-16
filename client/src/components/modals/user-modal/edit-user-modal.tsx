import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-model-store";
import toast from "react-hot-toast";
import { useSelectedPageContext } from "@/hooks/use-context";
import { useEffect } from "react";
import { apiUpdateUser } from "@/services/user.services";
import { User, RoleType } from "@/types/user.types";
import { v4 as uuidv4 } from "uuid";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  username: z.string().min(1, { message: "Username is required" }),
  firstname: z.string().min(1, { message: "First name is required" }),
  lastname: z.string().min(1, { message: "Last name is required" }),
  role: z.enum(["USER", "ADMIN"], { message: "Role is required" }),
  gender: z.enum(["MALE", "FEMALE", "OTHER"], {
    message: "Gender is required",
  }),
  phoneNumber: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, { message: "Invalid phone number" })
    .optional(),
  address: z.string().optional(),
  level: z.coerce.number().min(0, { message: "Level must be at least 0" }),
  total_score: z.coerce
    .number()
    .min(0, { message: "Total score must be at least 0" }),
  enrolledCoursesCount: z.coerce
    .number()
    .min(0, { message: "Enrolled courses count must be at least 0" }),
  avatar: z.string().url({ message: "Avatar must be a valid URL" }).optional(),
  typeLogin: z.enum(["email"], {
    message: "Login type is required",
  }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export const EditUserModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const { user: userToEdit } = data || {};
  const isModalOpen = isOpen && type === "editUser";
  const { setSelectedPage, setUser } = useSelectedPageContext();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      username: "",
      firstname: "",
      lastname: "",
      role: "USER",
      gender: "MALE",
      typeLogin: "email",
      phoneNumber: "",
      address: "",
      level: 0,
      total_score: 0,
      enrolledCoursesCount: 0,
      avatar: "",
      password: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  // Populate form when modal opens with user data
  useEffect(() => {
    if (isModalOpen && userToEdit) {
      form.reset({
        email: userToEdit.email,
        username: userToEdit.username,
        firstname: userToEdit.firstname,
        lastname: userToEdit.lastname,
        role: userToEdit.role,
        gender: userToEdit.gender,
        phoneNumber: userToEdit.phoneNumber || "",
        address: userToEdit.address || "",
        level: userToEdit.level,
        total_score: userToEdit.total_score,
        enrolledCoursesCount: userToEdit.enrolledCoursesCount,
        avatar: userToEdit.avatar || "",
      });
    } else if (!isModalOpen) {
      form.reset({
        email: "",
        username: "",
        firstname: "",
        lastname: "",
        role: "USER",
        gender: "MALE",
        phoneNumber: "",
        address: "",
        level: 0,
        total_score: 0,
        enrolledCoursesCount: 0,
        avatar: "",
      });
    }
  }, [isModalOpen, userToEdit, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const payload: User = {
        _id: userToEdit?._id,
        id: uuidv4(),
        tokenLogin: uuidv4(),
        refreshToken: "",
        typeLogin: values.typeLogin, // Explicitly set required field
        username: values.username,
        firstname: values.firstname,
        lastname: values.lastname,
        email: values.email,
        password: values.password,
        role: values.role,
        level: values.level,
        total_score: values.total_score,
        address: values.address || "", // Default empty string for required field
        gender: values.gender,
        enrolledCoursesCount: values.enrolledCoursesCount,
        phoneNumber: values.phoneNumber || "", // Default empty string for required field
        avatar: values.avatar,
      };

      const res = await apiUpdateUser(userToEdit?._id, payload);
      if (res?.data) {
        toast.success(`Đã cập nhật người dùng ${values.username} thành công`);
        onClose();
        setUser(res.data); // Update user in context
        setSelectedPage("Users");
      }
      form.reset();
    } catch (error) {
      toast.error("Lỗi khi cập nhật người dùng");
      console.error(error);
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-y-auto max-h-[90vh]">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Chỉnh sửa Người Dùng
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4 px-6">
              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-100 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Enter email (e.g., user@example.com)"
                        {...field}
                        type="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Username */}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-100 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Enter username"
                        {...field}
                        type="text"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-100 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Enter password"
                        {...field}
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Firstname */}
              <FormField
                control={form.control}
                name="firstname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-100 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Enter first name"
                        {...field}
                        type="text"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Lastname */}
              <FormField
                control={form.control}
                name="lastname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-100 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Enter last name"
                        {...field}
                        type="text"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Role */}
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-zinc-100 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0">
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(RoleType).map((type) => (
                          <SelectItem key={type} value={type}>
                            {type.toLowerCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Gender */}
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-zinc-100 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {["MALE", "FEMALE", "OTHER"].map((type) => (
                          <SelectItem key={type} value={type}>
                            {type.toLowerCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="typeLogin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Login Type</FormLabel>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-zinc-100 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0">
                          <SelectValue placeholder="Select login type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {["email"].map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone Number */}
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-100 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Enter phone number (e.g., +1234567890)"
                        {...field}
                        type="tel"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Address */}
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-100 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Enter address"
                        {...field}
                        type="text"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Level */}
              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Level</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-100 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Enter level"
                        {...field}
                        type="number"
                        min={0}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Total Score */}
              <FormField
                control={form.control}
                name="total_score"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Score</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-100 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Enter total score"
                        {...field}
                        type="number"
                        min={0}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Enrolled Courses Count */}
              <FormField
                control={form.control}
                name="enrolledCoursesCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enrolled Courses Count</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-100 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Enter enrolled courses count"
                        {...field}
                        type="number"
                        min={0}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Avatar */}
              <FormField
                control={form.control}
                name="avatar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Avatar URL (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-100 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Enter avatar URL (e.g., https://example.com/avatar.png)"
                        {...field}
                        type="url"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button
                onClick={handleClose}
                className="text-black rounded-[4px] bg-gray-200 hover:bg-gray-300"
              >
                Đóng
              </Button>
              <Button
                disabled={isLoading}
                type="submit"
                className="bg-blue-600 text-white hover:bg-blue-700 rounded-[4px]"
              >
                Cập nhật
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
