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
import { useState, useEffect } from "react";
import { apiUpdateTeam } from "@/services/team.services"; // Assuming you have this service
import { apiGetAllSports } from "@/services/sport.services";
import { useSelectedPageContext } from "@/hooks/use-context";
import toast from "react-hot-toast";
import { Team } from "@/types/team.types"; // Ensure these types are correctly imported
import { Sport } from "@/types/sport.types";

// Schema for editing a team, similar to creation but adjusting for updates
const formSchema = z.object({
  name: z.string().min(1, { message: "Team name is required" }),
  slug: z
    .string()
    .min(1, { message: "Slug is required" })
    .regex(/^[a-z0-9-]+$/i, {
      message: "Slug must contain only lowercase letters, numbers, or hyphens",
    })
    .transform((val) => val.toLowerCase()),
  logo: z.string().url({ message: "Logo must be a valid URL" }).optional(),
  sport: z.string().min(1, { message: "Sport is required" }), // ID of the sport
});

export const EditTeamModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === "editTeam";
  const { setSelectedPage, setTeam, team } = useSelectedPageContext(); // Changed to `setTeams` and `teams` for clarity and consistency
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

  // Fetch sports when the modal opens
  useEffect(() => {
    if (!isModalOpen) return;
    fetchSports();
  }, [isModalOpen]);

  // Populate form with existing team data when available
  useEffect(() => {
    if (isModalOpen && data?.team) {
      form.reset({
        name: data.team.name,
        slug: data.team.slug,
        logo: data.team.logo || "",
        sport: data?.team?.sport?._id,
      });
    }
  }, [form, data?.team, isModalOpen]);

  const fetchSports = async () => {
    try {
      const res = await apiGetAllSports();
      setSports(res.data);
    } catch (error) {
      toast.error("Lỗi khi tải danh sách môn thể thao");
      console.error(error);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Find the Sport object based on the selected ID
      const selectedSport = sports.find((s) => s._id === values.sport);
      if (!selectedSport) {
        toast.error("Môn thể thao không hợp lệ");
        return;
      }

      // Create the payload for the API call, ensuring 'sport' is the full object
      const payload: Partial<Team> = {
        name: values.name,
        slug: values.slug,
        logo: values.logo || undefined, // Use undefined for optional empty string
        sport: selectedSport, // Send the full Sport object
      };

      if (!data?.team?._id) {
        toast.error("Không tìm thấy ID đội bóng để cập nhật.");
        return;
      }

      // Call the API to update the team
      const res = await apiUpdateTeam(data.team._id, payload); // Assuming apiUpdateTeam exists and takes ID and payload
      if (res?.data) {
        toast.success(`Đã cập nhật ${values.name} thành công`);
        const updatedList = team?.map((item) =>
          item._id === res.data._id ? res.data : item
        );
        setTeam(updatedList);
        onClose();
        setSelectedPage("Teams");
      }
    } catch (error) {
      toast.error("Lỗi khi cập nhật đội bóng");
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
            Chỉnh sửa Đội bóng
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4 px-6">
              {" "}
              {/* Changed from space-y-8 to space-y-4 for consistency */}
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team Name</FormLabel> {/* Simplified label */}
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-100 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Enter team name"
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
                    <FormLabel>Slug</FormLabel> {/* Simplified label */}
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-100 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Enter slug"
                        {...field}
                        type="text"
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
                    <FormLabel>Logo URL (Optional)</FormLabel>{" "}
                    {/* Simplified label */}
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-100 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Enter logo URL"
                        {...field}
                        type="url"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Sport Select */}
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
