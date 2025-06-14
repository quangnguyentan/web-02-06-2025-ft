import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-model-store";
import toast from "react-hot-toast";
import { useSelectedPageContext } from "@/hooks/use-context";
import { useState, useEffect } from "react";
import { apiUpdateMatch } from "@/services/match.services"; // Đã đổi sang API update
import { apiGetAllTeams } from "@/services/team.services";
import { apiGetAllLeagues } from "@/services/league.services";
import { apiGetAllSports } from "@/services/sport.services";
import { Match, MatchStatusType } from "@/types/match.types";
import { Team } from "@/types/team.types";
import { League } from "@/types/league.types";
import { Sport } from "@/types/sport.types";

// Schema cho form (giữ nguyên vì cấu trúc dữ liệu không đổi)
const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  slug: z.string().min(1, { message: "Slug is required" }),
  homeTeam: z.string().min(1, { message: "Home team is required" }),
  awayTeam: z.string().min(1, { message: "Away team is required" }),
  league: z.string().min(1, { message: "League is required" }),
  sport: z.string().min(1, { message: "Sport is required" }),
  startTime: z.string().min(1, { message: "Start time is required" }),
  status: z.enum(Object.values(MatchStatusType) as [string, ...string[]], {
    required_error: "Status is required",
  }),
  scores: z.object({
    homeScore: z.coerce
      .number()
      .min(0, { message: "Home score must be a number" }),
    awayScore: z.coerce
      .number()
      .min(0, { message: "Away score must be a number" }),
  }),
  streamLinks: z
    .array(
      z.object({
        label: z.string().min(1, { message: "Label is required" }),
        url: z.string().url({ message: "Invalid URL" }),
        commentator: z.string().optional(),
        commentatorImage: z.string().optional(),
        priority: z.coerce
          .number()
          .min(1, { message: "Priority must be at least 1" }),
      })
    )
    .min(1, { message: "At least one stream link is required" }),
  isHot: z.boolean(),
});

export const EditMatchModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const { match: matchToEdit } = data; // Lấy dữ liệu trận đấu cần chỉnh sửa từ data
  const isModalOpen = isOpen && type === "editMatch";
  const { setSelectedPage, setMatch, match } = useSelectedPageContext();

  const [teams, setTeams] = useState<Team[]>([]);
  const [leagues, setLeagues] = useState<League[]>([]);
  const [sports, setSports] = useState<Sport[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      slug: "",
      homeTeam: "",
      awayTeam: "",
      league: "",
      sport: "",
      startTime: "",
      status: MatchStatusType.UPCOMING,
      scores: {
        homeScore: 0,
        awayScore: 0,
      },
      streamLinks: [
        {
          label: "",
          url: "",
          commentator: "",
          commentatorImage: "",
          priority: 1,
        },
      ],
      isHot: false,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "streamLinks",
  });

  const isLoading = form.formState.isSubmitting;

  // Lấy dữ liệu teams, leagues, sports từ API và điền vào form khi modal mở và có dữ liệu trận đấu
  useEffect(() => {
    if (!isModalOpen) return;

    const fetchData = async () => {
      try {
        const [teamsRes, leaguesRes, sportsRes] = await Promise.all([
          apiGetAllTeams(),
          apiGetAllLeagues(),
          apiGetAllSports(),
        ]);
        setTeams(teamsRes.data);
        setLeagues(leaguesRes.data);
        setSports(sportsRes.data);

        // Điền dữ liệu vào form nếu có matchToEdit
      } catch (error) {
        toast.error("Lỗi khi tải dữ liệu");
        console.error(error);
      }
    };

    fetchData();
  }, [isModalOpen, matchToEdit, form]); // Thêm form vào dependency array
  useEffect(() => {
    if (matchToEdit) {
      form.setValue("title", matchToEdit.title);
      form.setValue("slug", matchToEdit.slug);
      form.setValue("homeTeam", matchToEdit.homeTeam._id);
      form.setValue("awayTeam", matchToEdit.awayTeam._id);
      form.setValue("league", matchToEdit.league._id);
      form.setValue("sport", matchToEdit.sport._id);
      // Định dạng thời gian cho input datetime-local
      const startTimeFormatted = new Date(matchToEdit.startTime)
        .toISOString()
        .slice(0, 16);
      form.setValue("startTime", startTimeFormatted);
      form.setValue("status", matchToEdit.status);
      form.setValue("scores", {
        homeScore: matchToEdit.scores.homeScore,
        awayScore: matchToEdit.scores.awayScore,
      });
      form.setValue("streamLinks", matchToEdit.streamLinks);
      form.setValue("isHot", matchToEdit.isHot);
    }
  }, [matchToEdit, form]);
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Tìm object Team, League, Sport dựa trên ID
      const homeTeam = teams.find((t) => t._id === values.homeTeam);
      const awayTeam = teams.find((t) => t._id === values.awayTeam);
      const league = leagues.find((l) => l._id === values.league);
      const sport = sports.find((s) => s._id === values.sport);

      // Kiểm tra xem có tìm thấy các object không
      if (!homeTeam || !awayTeam || !league || !sport) {
        toast.error("Dữ liệu đội, giải đấu hoặc môn thể thao không hợp lệ");
        return;
      }

      // Tạo payload cho việc cập nhật
      const payload: Match = {
        ...values,
        homeTeam,
        awayTeam,
        league,
        sport,
        startTime: new Date(values.startTime),
        status: values.status as MatchStatusType,
        _id: matchToEdit?._id, // Thêm _id của trận đấu cần cập nhật
      };

      const res = await apiUpdateMatch(matchToEdit?._id, payload); // Gọi API cập nhật
      if (res?.data) {
        toast.success(`Đã cập nhật ${values.title} thành công`);
        onClose();
        // Cập nhật trận đấu trong danh sách `matches` của context
        const updatedList = match?.map((item) =>
          item._id === res.data._id ? res.data : item
        );
        setMatch(updatedList);
        setSelectedPage("Matches");
      }
      form.reset();
    } catch (error) {
      toast.error("Lỗi khi cập nhật trận đấu");
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
            Chỉnh sửa trận đấu
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

              {/* Home Team */}
              <FormField
                control={form.control}
                name="homeTeam"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Home Team</FormLabel>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select home team" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {teams.map((team) => (
                          <SelectItem key={team._id} value={team._id}>
                            {team.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Away Team */}
              <FormField
                control={form.control}
                name="awayTeam"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Away Team</FormLabel>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select away team" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {teams.map((team) => (
                          <SelectItem key={team._id} value={team._id}>
                            {team.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* League */}
              <FormField
                control={form.control}
                name="league"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>League</FormLabel>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select league" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {leagues.map((league) => (
                          <SelectItem key={league._id} value={league._id}>
                            {league.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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

              {/* Start Time */}
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        type="datetime-local"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Status */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(MatchStatusType).map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Scores */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="scores.homeScore"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Home Score</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          type="number"
                          min={0}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="scores.awayScore"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Away Score</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          type="number"
                          min={0}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Stream Links */}
              <div>
                <FormLabel>Stream Links</FormLabel>
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="space-y-2 border p-4 rounded mb-4"
                  >
                    <FormField
                      control={form.control}
                      name={`streamLinks.${index}.label`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Label</FormLabel>
                          <FormControl>
                            <Input disabled={isLoading} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`streamLinks.${index}.url`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>URL</FormLabel>
                          <FormControl>
                            <Input disabled={isLoading} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`streamLinks.${index}.commentator`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Commentator (Optional)</FormLabel>
                          <FormControl>
                            <Input disabled={isLoading} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`streamLinks.${index}.commentatorImage`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Commentator Image (Optional)</FormLabel>
                          <FormControl>
                            <Input disabled={isLoading} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`streamLinks.${index}.priority`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Priority</FormLabel>
                          <FormControl>
                            <Input
                              disabled={isLoading}
                              type="number"
                              min={1}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => remove(index)}
                      disabled={isLoading || fields.length === 1}
                    >
                      Xóa link
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  onClick={() =>
                    append({ label: "", url: "", commentator: "", priority: 1 })
                  }
                  disabled={isLoading}
                >
                  Thêm Stream Link
                </Button>
              </div>

              {/* Is Hot */}
              <FormField
                control={form.control}
                name="isHot"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormLabel>Hot Match</FormLabel>
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
                Cập nhật
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
