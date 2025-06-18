import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray, Controller } from "react-hook-form"; // Added Controller
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
import { apiCreateMatch } from "@/services/match.services";
import { apiGetAllTeams } from "@/services/team.services";
import { apiGetAllLeagues } from "@/services/league.services";
import { apiGetAllSports } from "@/services/sport.services";
import { Match, MatchStatusType } from "@/types/match.types";
import { Team } from "@/types/team.types";
import { League } from "@/types/league.types";
import { Sport } from "@/types/sport.types";
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
  homeTeam: z.string().min(1, { message: "Home team is required" }),
  awayTeam: z.string().min(1, { message: "Away team is required" }),
  league: z.string().min(1, { message: "League is required" }),
  sport: z.string().min(1, { message: "Sport is required" }),
  startTime: z.date({ required_error: "Start time is required" }), // Changed to z.date
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
  mainCommentator: z.string().optional(),
  mainCommentatorImage: z.string().optional(),
  secondaryCommentator: z.string().optional(),
  secondaryCommentatorImage: z.string().optional(),
});

export const CreateMatchModal = () => {
  const { isOpen, onClose, type } = useModal();
  const isModalOpen = isOpen && type === "createMatch";
  const { setSelectedPage, addMatch } = useSelectedPageContext();
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
      startTime: null, // Default to null, will be set as Date object
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
      mainCommentator: "",
      mainCommentatorImage: "",
      secondaryCommentator: "",
      secondaryCommentatorImage: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "streamLinks",
  });

  const isLoading = form.formState.isSubmitting;

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
      } catch (error) {
        toast.error("Lỗi khi tải dữ liệu");
        console.error(error);
      }
    };

    fetchData();
  }, [isModalOpen]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const homeTeam = teams.find((t) => t._id === values.homeTeam);
      const awayTeam = teams.find((t) => t._id === values.awayTeam);
      const league = leagues.find((l) => l._id === values.league);
      const sport = sports.find((s) => s._id === values.sport);

      if (!homeTeam || !awayTeam || !league || !sport) {
        toast.error("Dữ liệu đội, giải đấu hoặc môn thể thao không hợp lệ");
        return;
      }

      const payload: Match = {
        ...values,
        homeTeam,
        awayTeam,
        league,
        sport,
        startTime: values.startTime, // Already a Date object
        status: values.status as MatchStatusType,
      };

      const res = await apiCreateMatch(payload);
      if (res?.data) {
        toast.success(`Đã tạo ${values.title} thành công`);
        onClose();
        addMatch(res.data);
        setSelectedPage("Matches");
      }
      form.reset();
    } catch (error) {
      toast.error("Lỗi khi tạo trận đấu");
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
            Tạo trận đấu
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

              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                      <Controller
                        name="startTime"
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
                            minDate={new Date()} // Prevent selecting past dates
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
                Tạo
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
