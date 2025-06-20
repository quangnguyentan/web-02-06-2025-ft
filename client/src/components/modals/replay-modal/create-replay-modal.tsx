import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
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
import { apiCreateReplay } from "@/services/replay.services";
import { apiGetAllMatches } from "@/services/match.services";
import { apiGetAllSports } from "@/services/sport.services";
import { Match } from "@/types/match.types";
import { Replay } from "@/types/replay.types";
import { Sport } from "@/types/sport.types";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import { vi } from "date-fns/locale/vi";
import { useDropzone } from "react-dropzone";

registerLocale("vi", vi);
setDefaultLocale("vi");

const formSchema = z.object({
  title: z.string().min(1, { message: "Tiêu đề là bắt buộc" }),
  slug: z.string().min(1, { message: "Slug là bắt buộc" }),
  description: z.string().optional(),
  videoUrl: z
    .instanceof(File)
    .refine((file) => file && /video\/(mp4|mov|avi)/.test(file.type), {
      message: "Vui lòng chọn file video hợp lệ (.mp4, .mov, .avi)",
    }),
  thumbnail: z
    .instanceof(File)
    .refine((file) => file && /image\/(jpg|jpeg|png)/.test(file.type), {
      message: "Vui lòng chọn file ảnh hợp lệ (.jpg, .jpeg, .png)",
    })
    .optional(),
  match: z.string().min(1, { message: "Trận đấu là bắt buộc" }),
  sport: z.string().min(1, { message: "Môn thể thao là bắt buộc" }),
  duration: z.coerce
    .number()
    .min(0, { message: "Thời lượng phải là số không âm" })
    .optional(),
  views: z.coerce.number().min(0, { message: "Lượt xem phải là số không âm" }),
  commentator: z.string().optional(),
  publishDate: z.date({ required_error: "Ngày phát hành là bắt buộc" }),
  isShown: z.boolean(),
});

export const CreateReplayModal = () => {
  const { isOpen, onClose, type } = useModal();
  const isModalOpen = isOpen && type === "createReplay";
  const { setSelectedPage, addReplay } = useSelectedPageContext();
  const [matches, setMatches] = useState<Match[]>([]);
  const [sports, setSports] = useState<Sport[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      videoUrl: undefined,
      thumbnail: undefined,
      match: "",
      sport: "",
      duration: undefined,
      views: 0,
      commentator: "",
      publishDate: new Date(),
      isShown: false,
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onDropVideo = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles[0]) {
        form.setValue("videoUrl", acceptedFiles[0], { shouldValidate: true });
      }
    },
    [form]
  );

  const {
    getRootProps: getVideoRootProps,
    getInputProps: getVideoInputProps,
    isDragActive: isVideoDragActive,
  } = useDropzone({
    onDrop: onDropVideo,
    accept: {
      "video/mp4": [".mp4"],
      "video/mov": [".mov"],
      "video/avi": [".avi"],
    },
    maxFiles: 1,
    maxSize: 100 * 1024 * 1024,
    onDropRejected: (fileRejections) => {
      const error =
        fileRejections[0]?.errors[0]?.message || "File video không hợp lệ";
      toast.error(error);
    },
  });

  const onDropThumbnail = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles[0]) {
        form.setValue("thumbnail", acceptedFiles[0], { shouldValidate: true });
      }
    },
    [form]
  );

  const {
    getRootProps: getThumbnailRootProps,
    getInputProps: getThumbnailInputProps,
    isDragActive: isThumbnailDragActive,
  } = useDropzone({
    onDrop: onDropThumbnail,
    accept: { "image/jpeg": [".jpg", ".jpeg"], "image/png": [".png"] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
    onDropRejected: (fileRejections) => {
      const error =
        fileRejections[0]?.errors[0]?.message || "File ảnh không hợp lệ";
      toast.error(error);
    },
  });

  useEffect(() => {
    if (!isModalOpen) return;

    const fetchData = async () => {
      try {
        const [matchRes, sportsRes] = await Promise.all([
          apiGetAllMatches(),
          apiGetAllSports(),
        ]);
        setMatches(matchRes.data);
        setSports(sportsRes.data);
      } catch (error) {
        toast.error("Lỗi khi tải dữ liệu trận đấu hoặc môn thể thao");
        console.error(error);
      }
    };

    fetchData();
  }, [isModalOpen]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const match = matches.find((m) => m._id === values.match);
      if (!match) {
        toast.error("Trận đấu không hợp lệ");
        return;
      }
      const sport = sports.find((s) => s._id === values.sport);
      if (!sport) {
        toast.error("Môn thể thao không hợp lệ");
        return;
      }

      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("slug", values.slug);
      if (values.description)
        formData.append("description", values.description);
      formData.append("videoUrl", values.videoUrl);
      if (values.thumbnail) formData.append("thumbnail", values.thumbnail);
      formData.append("match", values.match);
      formData.append("sport", values.sport);
      if (values.duration !== undefined)
        formData.append("duration", values.duration.toString());
      formData.append("views", values.views.toString());
      if (values.commentator)
        formData.append("commentator", values.commentator);
      formData.append("publishDate", values.publishDate.toISOString());
      formData.append("isShown", values.isShown.toString());

      const res = await apiCreateReplay(formData);
      if (res?.data) {
        toast.success(`Đã tạo ${values.title} thành công`);
        onClose();
        addReplay(res.data);
        setSelectedPage("Replays");
        form.reset();
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Lỗi khi tạo nội dung phát lại";
      toast.error(errorMessage);
      console.error(error);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-y-auto max-h-[90vh]">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Tạo trận đấu phát lại
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4 px-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tiêu đề</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="Nhập tiêu đề"
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
                        placeholder="Nhập slug"
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
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả (Không bắt buộc)</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="Nhập mô tả"
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
                name="videoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>File Video</FormLabel>
                    <FormControl>
                      <div
                        {...getVideoRootProps()}
                        className={`border-2 border-dashed p-4 rounded-lg text-center cursor-pointer ${
                          isVideoDragActive
                            ? "border-blue-500"
                            : "border-gray-300"
                        }`}
                      >
                        <input {...getVideoInputProps()} />
                        {field.value ? (
                          <p className="text-blue-600">{field.value.name}</p>
                        ) : (
                          <p>
                            Kéo và thả file video tại đây (.mp4, .mov, .avi)
                          </p>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="thumbnail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ảnh nhỏ (Không bắt buộc)</FormLabel>
                    <FormControl>
                      <div
                        {...getThumbnailRootProps()}
                        className={`border-2 border-dashed p-4 rounded-lg text-center cursor-pointer ${
                          isThumbnailDragActive
                            ? "border-blue-500"
                            : "border-gray-300"
                        }`}
                      >
                        <input {...getThumbnailInputProps()} />
                        {field.value ? (
                          <p className="text-blue-600">{field.value.name}</p>
                        ) : (
                          <p>Kéo và thả file ảnh tại đây (.jpg, .png)</p>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="match"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trận đấu</FormLabel>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn trận đấu" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white text-black h-[220px]">
                        {matches.map((match) => (
                          <SelectItem key={match._id} value={match._id}>
                            {match.title}
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
                name="sport"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Môn thể thao</FormLabel>
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
                      <SelectContent className="bg-white text-black h-[220px]">
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
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thời lượng (phút, Không bắt buộc)</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="Nhập thời lượng"
                        {...field}
                        type="number"
                        min={0}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="publishDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Ngày phát hành</FormLabel>
                    <FormControl>
                      <Controller
                        name="publishDate"
                        control={form.control}
                        render={({ field: dateField }) => (
                          <DatePicker
                            selected={dateField.value}
                            onChange={(date) => dateField.onChange(date)}
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={15}
                            dateFormat="dd/MM/yyyy HH:mm"
                            locale="vi"
                            disabled={isLoading}
                            placeholderText="Nhập ngày và giờ"
                            className="w-full p-2 border rounded placeholder:text-gray-500"
                            minDate={new Date()}
                          />
                        )}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="views"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lượt xem</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="Nhập số lượt xem"
                        {...field}
                        type="number"
                        min={0}
                        value={field.value ?? 0}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="commentator"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bình luận viên (Không bắt buộc)</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="Nhập tên bình luận viên"
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
                name="isShown"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormLabel>Hiển thị trên trang chủ</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button
                onClick={handleClose}
                className="text-black rounded-[4px]"
              >
                Đóng
              </Button>
              <Button disabled={isLoading} type="submit">
                Tạo
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
