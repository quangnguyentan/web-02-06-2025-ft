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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-model-store";
import toast from "react-hot-toast";
import { useSelectedPageContext } from "@/hooks/use-context";
import { useState, useEffect, useCallback } from "react";
import { apiUpdateSport } from "@/services/sport.services";
import { useDropzone } from "react-dropzone";
import { Checkbox } from "@/components/ui/checkbox";

const sportFormSchema = z.object({
  name: z.string().min(1, { message: "Tên môn thể thao là bắt buộc" }),
  slug: z
    .string()
    .min(1, { message: "Slug là bắt buộc" })
    .regex(/^[a-z0-9-]+$/i, {
      message: "Slug chỉ được chứa chữ thường, số hoặc dấu gạch ngang",
    })
    .transform((val) => val.toLowerCase()),
  icon: z
    .instanceof(File)
    .refine((file) => file && /image\/(jpg|jpeg|png)/.test(file.type), {
      message: "Vui lòng chọn file ảnh hợp lệ (.jpg, .jpeg, .png)",
    })
    .optional(),
  order: z.coerce.number().min(1, { message: "Thứ tự phải là số không âm" }),
  removeIcon: z.boolean().optional(),
});

export const EditSportModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const { sport } = data;
  const isModalOpen = isOpen && type === "editSport";
  const { setSelectedPage, sports, setSports } = useSelectedPageContext();
  const [currentIcon, setCurrentIcon] = useState<string | undefined>(undefined);

  const form = useForm({
    resolver: zodResolver(sportFormSchema),
    defaultValues: {
      name: "",
      slug: "",
      icon: undefined,
      order: 1,
      removeIcon: false,
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onDropIcon = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles[0]) {
        form.setValue("icon", acceptedFiles[0], { shouldValidate: true });
        form.setValue("removeIcon", false);
      }
    },
    [form]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDropIcon,
    accept: { "image/jpeg": [".jpg", ".jpeg"], "image/png": [".png"] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB limit to match multer
    onDropRejected: (fileRejections) => {
      const error =
        fileRejections[0]?.errors[0]?.message || "File ảnh không hợp lệ";
      toast.error(error);
    },
  });

  useEffect(() => {
    if (isModalOpen && sport) {
      form.reset({
        name: sport.name || "",
        slug: sport.slug || "",
        icon: undefined,
        order: sport.order ?? 1,
        removeIcon: false,
      });
      setCurrentIcon(sport.icon);
    } else if (!isModalOpen) {
      form.reset();
      setCurrentIcon(undefined);
    }
  }, [isModalOpen, sport, form]);

  const onSubmit = async (values: z.infer<typeof sportFormSchema>) => {
    try {
      if (!sport?._id) {
        toast.error("Không tìm thấy ID môn thể thao để cập nhật");
        return;
      }

      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("slug", values.slug);
      formData.append("order", values.order.toString());
      if (values.icon) {
        formData.append("icon", values.icon);
      }
      if (values.removeIcon && currentIcon) {
        formData.append("removeIcon", "true");
      }

      const res = await apiUpdateSport(sport._id, formData);
      if (res?.data) {
        const updatedList = sports?.map((item) =>
          item._id === res.data._id ? res.data : item
        );
        setSports(updatedList);
        toast.success(`Đã cập nhật ${values.name} thành công`);
        onClose();
        setSelectedPage("Sports");
        form.reset();
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Lỗi khi cập nhật môn thể thao";
      toast.error(errorMessage);
      console.error(error);
    }
  };

  const handleClose = () => {
    form.reset();
    setCurrentIcon(undefined);
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-y-auto max-h-[90vh]">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Chỉnh Sửa Môn Thể Thao
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4 px-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên Môn Thể Thao</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-100 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Nhập tên môn thể thao (ví dụ: Bóng đá)"
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
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-100 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Nhập slug (ví dụ: bong-da)"
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
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon (Không bắt buộc)</FormLabel>
                    <FormControl>
                      <div>
                        {currentIcon && !form.watch("removeIcon") && (
                          <div className="mb-2">
                            <img
                              src={currentIcon}
                              alt="Current icon"
                              className="h-20 w-20 object-contain"
                            />
                            <p className="text-sm text-gray-500">
                              Icon hiện tại
                            </p>
                          </div>
                        )}
                        <div
                          {...getRootProps()}
                          className={`border-2 border-dashed p-4 rounded-lg text-center cursor-pointer ${
                            isDragActive ? "border-blue-500" : "border-gray-300"
                          }`}
                        >
                          <input {...getInputProps()} />
                          {field.value ? (
                            <p className="text-blue-600">{field.value.name}</p>
                          ) : (
                            <p>
                              Kéo và thả file ảnh tại đây (.jpg, .jpeg, .png)
                            </p>
                          )}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="removeIcon"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                          if (checked) {
                            form.setValue("icon", undefined);
                          }
                        }}
                        disabled={isLoading || !currentIcon}
                      />
                    </FormControl>
                    <FormLabel>Xóa icon hiện tại</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thứ Tự</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-100 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Nhập thứ tự (ví dụ: 1)"
                        {...field}
                        type="number"
                        min={1}
                        value={field.value ?? 1}
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
                type="button"
                disabled={isLoading}
              >
                Đóng
              </Button>
              <Button
                disabled={isLoading}
                type="submit"
                className="bg-blue-600 text-white hover:bg-blue-700 rounded-[4px]"
              >
                Cập Nhật
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
