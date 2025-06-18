import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form"; // Added Controller
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
import { useState, useEffect } from "react";
import { apiCreateReplay } from "@/services/replay.services";
import { apiGetAllMatches } from "@/services/match.services";
import { Match } from "@/types/match.types";
import { Replay } from "@/types/replay.types";
import { Sport } from "@/types/sport.types";
import { apiGetAllSports } from "@/services/sport.services";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import { vi } from "date-fns/locale/vi";

// Đăng ký và đặt locale mặc định là tiếng Việt
registerLocale("vi", vi);
setDefaultLocale("vi");

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  slug: z.string().min(1, { message: "Slug is required" }),
  description: z.string().optional(),
  videoUrl: z.string().url({ message: "Invalid video URL" }),
  thumbnail: z.string().url({ message: "Invalid thumbnail URL" }).optional(),
  match: z.string().min(1, { message: "Match is required" }), // ID của trận đấu
  sport: z.string().min(1, { message: "Sport is required" }), // ID của môn thể thao
  duration: z.coerce
    .number()
    .min(0, { message: "Duration must be non-negative" })
    .optional(),
  views: z.coerce.number().min(0, { message: "Views must be non-negative" }),
  commentator: z.string().optional(),
  publishDate: z.date({ required_error: "Publish date is required" }), // Changed to z.date
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
      videoUrl: "",
      thumbnail: "",
      match: "",
      sport: "",
      duration: undefined,
      views: 0,
      commentator: "",
      publishDate: null, // Default to null, will be set as Date object
      isShown: false,
    },
  });

  const isLoading = form.formState.isSubmitting;

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
        toast.error("Lỗi khi tải dữ liệu");
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
      const sport = sports.find((m) => m._id === values.sport);
      if (!sport) {
        toast.error("Trận đấu không hợp lệ");
        return;
      }
      const payload: Replay = {
        ...values,
        match,
        sport,
        publishDate: values.publishDate, // Already a Date object
      };

      const res = await apiCreateReplay(payload);
      if (res?.data) {
        toast.success(`Đã tạo ${values.title} thành công`);
        onClose();
        addReplay(res.data);
        setSelectedPage("Replays");
      }
      form.reset();
    } catch (error) {
      toast.error("Lỗi khi tạo replay");
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
              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="Enter title"
                        {...field}
                        type="text"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Slug */}
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="Enter slug"
                        {...field}
                        type="text"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="Enter description"
                        {...field}
                        type="text"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Video URL */}
              <FormField
                control={form.control}
                name="videoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Video URL</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="Enter video URL"
                        {...field}
                        type="url"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Thumbnail */}
              <FormField
                control={form.control}
                name="thumbnail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thumbnail URL (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="Enter thumbnail URL"
                        {...field}
                        type="url"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Match */}
              <FormField
                control={form.control}
                name="match"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Match</FormLabel>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select match" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
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
                    <FormLabel>Sport</FormLabel>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select sport" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
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

              {/* Duration */}
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (minutes, Optional)</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="Enter duration"
                        {...field}
                        type="number"
                        min={0}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Publish Date */}
              <FormField
                control={form.control}
                name="publishDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Publish Date</FormLabel>
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
                            placeholderText="Chọn ngày và giờ"
                            className="w-full p-2 border rounded placeholder:text-black"
                            minDate={new Date()} // Prevent selecting past dates (today is 02:24 PM +07, June 18, 2025)
                          />
                        )}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Views */}
              <FormField
                control={form.control}
                name="views"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Views</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="Enter views"
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

              {/* Commentator */}
              <FormField
                control={form.control}
                name="commentator"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Commentator (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="Enter commentator"
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
