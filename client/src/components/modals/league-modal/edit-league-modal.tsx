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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useModal } from "@/hooks/use-model-store";
import { useEffect, useState } from "react";
import { useSelectedPageContext } from "@/hooks/use-context";
import toast from "react-hot-toast";
import { apiUpdateLeague } from "@/services/league.services";
import { apiGetAllSports } from "@/services/sport.services";
import { Sport } from "@/types/sport.types";
import { League } from "@/types/league.types";

const formSchema = z.object({
  name: z.string().min(1, { message: "League name is required" }),
  slug: z
    .string()
    .min(1, { message: "Slug is required" })
    .regex(/^[a-z0-9-]+$/i, {
      message: "Slug must contain only lowercase letters, numbers, or hyphens",
    })
    .transform((val) => val.toLowerCase()),
  logo: z.string().url({ message: "Logo must be a valid URL" }).optional(),
  sport: z.string().min(1, { message: "Sport is required" }),
});

export const EditLeagueModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === "editLeague";
  const { setSelectedPage, league, setLeague } = useSelectedPageContext();
  const [sports, setSports] = useState<Sport[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
      logo: "",
      sport: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  useEffect(() => {
    if (!isModalOpen) return;
    fetchSports();
  }, [isModalOpen]);

  const fetchSports = async () => {
    try {
      const res = await apiGetAllSports();
      setSports(res.data);
    } catch (error) {
      toast.error("Lỗi khi tải danh sách môn thể thao");
      console.error(error);
    }
  };

  useEffect(() => {
    if (data?.league) {
      form.setValue("name", data.league.name || "");
      form.setValue("slug", data.league.slug || "");
      form.setValue("logo", data.league.logo || "");
      form.setValue("sport", data.league.sport?._id || "");
    }
  }, [form, data?.league]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const sport = sports.find((s) => s._id === values.sport);
      if (!sport) {
        toast.error("Môn thể thao không hợp lệ");
        return;
      }
      const payload: League = {
        ...values,
        sport, // Gửi object Sport
      };
      const res = await apiUpdateLeague(data?.league?._id, payload);
      if (res?.data) {
        const updatedList = league?.map((item) =>
          item._id === res.data._id ? res.data : item
        );
        setLeague(updatedList);
        toast.success(`Đã cập nhật ${values?.name} thành công`);
        onClose();
        setSelectedPage("Leagues");
        form.reset();
      }
    } catch (error) {
      toast.error("Lỗi khi cập nhật giải đấu");
      console.error(error);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Chỉnh sửa giải đấu
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4 px-6">
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>League Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="Enter league name"
                        {...field}
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
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Logo */}
              <FormField
                control={form.control}
                name="logo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Logo URL (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="Enter logo URL"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Sport */}
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
            </div>

            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button
                onClick={handleClose}
                className="text-black bg-gray-200 hover:bg-gray-300 rounded-[4px]"
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
