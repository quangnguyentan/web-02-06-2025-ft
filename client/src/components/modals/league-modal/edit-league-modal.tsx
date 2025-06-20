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
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-model-store";
import toast from "react-hot-toast";
import { useSelectedPageContext } from "@/hooks/use-context";
import { useState, useEffect, useCallback } from "react";
import { apiUpdateLeague } from "@/services/league.services";
import { apiGetAllSports } from "@/services/sport.services";
import { League } from "@/types/league.types";
import { Sport } from "@/types/sport.types";
import { useDropzone } from "react-dropzone";
import { Checkbox } from "@/components/ui/checkbox";

const leagueFormSchema = z.object({
  name: z.string().min(1, { message: "Tên giải đấu là bắt buộc" }),
  slug: z
    .string()
    .min(1, { message: "Slug là bắt buộc" })
    .regex(/^[a-z0-9-]+$/i, {
      message: "Slug chỉ được chứa chữ thường, số hoặc dấu gạch ngang",
    })
    .transform((val) => val.toLowerCase()),
  logo: z
    .instanceof(File)
    .refine((file) => file && /image\/(jpg|jpeg|png)/.test(file.type), {
      message: "Vui lòng chọn file ảnh hợp lệ (.jpg, .jpeg, .png)",
    })
    .optional(),
  sport: z.string().min(1, { message: "Môn thể thao là bắt buộc" }),
  removeLogo: z.boolean().optional(),
});

export const EditLeagueModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const { league: leagueToEdit } = data;
  const isModalOpen = isOpen && type === "editLeague";
  const { setSelectedPage, league, setLeague } = useSelectedPageContext();
  const [sports, setSports] = useState<Sport[]>([]);
  const [currentLogo, setCurrentLogo] = useState<string | undefined>(undefined);

  const form = useForm<z.infer<typeof leagueFormSchema>>({
    resolver: zodResolver(leagueFormSchema),
    defaultValues: {
      name: "",
      slug: "",
      logo: undefined,
      sport: "",
      removeLogo: false,
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onDropLogo = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles[0]) {
        form.setValue("logo", acceptedFiles[0], { shouldValidate: true });
        form.setValue("removeLogo", false);
      }
    },
    [form]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDropLogo,
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
    if (!isModalOpen) return;

    const fetchSports = async () => {
      try {
        const res = await apiGetAllSports();
        setSports(res.data);
      } catch (error) {
        toast.error("Lỗi khi tải danh sách môn thể thao");
        console.error(error);
      }
    };

    fetchSports();
  }, [isModalOpen]);

  useEffect(() => {
    if (isModalOpen && leagueToEdit) {
      form.reset({
        name: leagueToEdit.name || "",
        slug: leagueToEdit.slug || "",
        logo: undefined,
        sport: leagueToEdit.sport?._id || "",
        removeLogo: false,
      });
      setCurrentLogo(leagueToEdit.logo);
    } else if (!isModalOpen) {
      form.reset();
      setCurrentLogo(undefined);
    }
  }, [isModalOpen, leagueToEdit, form]);

  const onSubmit = async (values: z.infer<typeof leagueFormSchema>) => {
    try {
      const sport = sports.find((s) => s._id === values.sport);
      if (!sport) {
        toast.error("Môn thể thao không hợp lệ");
        return;
      }

      if (!leagueToEdit?._id) {
        toast.error("Không tìm thấy ID giải đấu để cập nhật");
        return;
      }

      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("slug", values.slug);
      formData.append("sport", values.sport);
      if (values.logo) {
        formData.append("logo", values.logo);
      }
      if (values.removeLogo && currentLogo) {
        formData.append("removeLogo", "true");
      }

      const res = await apiUpdateLeague(leagueToEdit._id, formData);
      if (res?.data) {
        const updatedList = league?.map((item) =>
          item._id === res.data._id ? res.data : item
        );
        setLeague(updatedList);
        toast.success(`Đã cập nhật ${values.name} thành công`);
        onClose();
        setSelectedPage("Leagues");
        form.reset();
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Lỗi khi cập nhật giải đấu";
      toast.error(errorMessage);
      console.error(error);
    }
  };

  const handleClose = () => {
    form.reset();
    setCurrentLogo(undefined);
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-y-auto max-h-[90vh]">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Chỉnh Sửa Giải Đấu
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
                    <FormLabel>Tên Giải Đấu</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-100 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Nhập tên giải đấu (ví dụ: Premier League)"
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
                        placeholder="Nhập slug (ví dụ: premier-league)"
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
                name="logo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Logo (Không bắt buộc)</FormLabel>
                    <FormControl>
                      <div>
                        {currentLogo && !form.watch("removeLogo") && (
                          <div className="mb-2">
                            <img
                              src={currentLogo}
                              alt="Current logo"
                              className="h-20 w-20 object-contain"
                            />
                            <p className="text-sm text-gray-500">
                              Logo hiện tại
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
                name="removeLogo"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                          if (checked) {
                            form.setValue("logo", undefined);
                          }
                        }}
                        disabled={isLoading || !currentLogo}
                      />
                    </FormControl>
                    <FormLabel>Xóa logo hiện tại</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sport"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Môn Thể Thao</FormLabel>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn môn thể thao" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white text-black">
                        {sports.map((sport) => (
                          <SelectItem key={sport._id} value={sport._id}>
                            {sport.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
