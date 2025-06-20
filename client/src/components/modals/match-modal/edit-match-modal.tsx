import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller, useFieldArray } from "react-hook-form";
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
import { apiUpdateMatch } from "@/services/match.services";
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
import { useDropzone } from "react-dropzone";
import { PlusCircle, XCircle } from "lucide-react";

registerLocale("vi", vi);
setDefaultLocale("vi");

const streamLinkSchema = z.object({
  label: z.string().min(1, { message: "Nhãn liên kết là bắt buộc" }),
  url: z
    .string()
    .url("URL không hợp lệ")
    .min(1, { message: "URL liên kết là bắt buộc" }),
  image: z
    .union([
      z.string().url("URL ảnh không hợp lệ").optional(),
      z
        .instanceof(File)
        .refine((file) => /image\/(jpg|jpeg|png)/.test(file.type), {
          message: "Vui lòng chọn file ảnh hợp lệ (.jpg, .jpeg, .png)",
        })
        .optional(),
    ])
    .optional(),
  commentator: z.string().optional(),
  commentatorImage: z
    .union([
      z.string().url("URL ảnh không hợp lệ").optional(),
      z
        .instanceof(File)
        .refine((file) => /image\/(jpg|jpeg|png)/.test(file.type), {
          message: "Vui lòng chọn file ảnh hợp lệ (.jpg, .jpeg, .png)",
        })
        .optional(),
    ])
    .optional(),
  priority: z.coerce
    .number()
    .min(1, { message: "Ưu tiên phải là số không âm" })
    .optional(),
});

const formSchema = z.object({
  title: z.string().min(1, { message: "Tiêu đề là bắt buộc" }),
  slug: z.string().min(1, { message: "Slug là bắt buộc" }),
  homeTeam: z.string().min(1, { message: "Đội nhà là bắt buộc" }),
  awayTeam: z.string().min(1, { message: "Đội khách là bắt buộc" }),
  league: z.string().min(1, { message: "Giải đấu là bắt buộc" }),
  sport: z.string().min(1, { message: "Môn thể thao là bắt buộc" }),
  startTime: z.date({ required_error: "Ngày bắt đầu là bắt buộc" }),
  status: z.enum(Object.values(MatchStatusType) as [string, ...string[]], {
    required_error: "Trạng thái là bắt buộc",
  }),
  scores: z
    .object({
      homeScore: z.coerce
        .number()
        .min(0, { message: "Tỉ số đội nhà phải là số không âm" })
        .optional(),
      awayScore: z.coerce
        .number()
        .min(0, { message: "Tỉ số đội khách phải là số không âm" })
        .optional(),
    })
    .optional(),
  mainCommentator: z.string().optional(),
  mainCommentatorImage: z
    .instanceof(File)
    .refine((file) => !file || /image\/(jpg|jpeg|png)/.test(file.type), {
      message: "Vui lòng chọn file ảnh hợp lệ (.jpg, .jpeg, .png)",
    })
    .optional(),
  secondaryCommentator: z.string().optional(),
  secondaryCommentatorImage: z
    .instanceof(File)
    .refine((file) => !file || /image\/(jpg|jpeg|png)/.test(file.type), {
      message: "Vui lòng chọn file ảnh hợp lệ (.jpg, .jpeg, .png)",
    })
    .optional(),
  isHot: z.boolean().optional(),
  streamLinks: z.array(streamLinkSchema).optional(),
});

interface StreamLinkFieldProps {
  index: number;
  form: any;
  remove: (index: number) => void;
  isLoading: boolean;
}

const StreamLinkField: React.FC<StreamLinkFieldProps> = ({
  index,
  form,
  remove,
  isLoading,
}) => {
  const onDropImage = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles[0]) {
        form.setValue(`streamLinks.${index}.image`, acceptedFiles[0], {
          shouldValidate: true,
        });
      }
    },
    [form, index]
  );

  const {
    getRootProps: getImageRootProps,
    getInputProps: getImageInputProps,
    isDragActive: isImageDragActive,
  } = useDropzone({
    onDrop: onDropImage,
    accept: { "image/jpeg": [".jpg", ".jpeg"], "image/png": [".png"] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
    onDropRejected: (fileRejections) => {
      const error =
        fileRejections[0]?.errors[0]?.message || "File ảnh không hợp lệ";
      toast.error(error);
    },
  });

  const onDropCommentatorImage = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles[0]) {
        form.setValue(
          `streamLinks.${index}.commentatorImage`,
          acceptedFiles[0],
          {
            shouldValidate: true,
          }
        );
      }
    },
    [form, index]
  );

  const {
    getRootProps: getCommentatorImageRootProps,
    getInputProps: getCommentatorImageInputProps,
    isDragActive: isCommentatorImageDragActive,
  } = useDropzone({
    onDrop: onDropCommentatorImage,
    accept: { "image/jpeg": [".jpg", ".jpeg"], "image/png": [".png"] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
    onDropRejected: (fileRejections) => {
      const error =
        fileRejections[0]?.errors[0]?.message || "File ảnh không hợp lệ";
      toast.error(error);
    },
  });

  return (
    <div className="grid grid-cols-1 gap-4 border p-3 rounded-md relative">
      <Button
        type="button"
        onClick={() => remove(index)}
        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full w-6 h-6 flex items-center justify-center"
        disabled={isLoading}
      >
        <XCircle className="h-4 w-4" />
      </Button>
      <FormField
        control={form.control}
        name={`streamLinks.${index}.label`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Nhãn <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input
                disabled={isLoading}
                placeholder="Ví dụ: K+SPORT1"
                {...field}
              />
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
            <FormLabel>
              URL <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input
                disabled={isLoading}
                placeholder="Ví dụ: https://example.com/stream"
                type="text"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`streamLinks.${index}.image`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ảnh đại diện link</FormLabel>
            <FormControl>
              <div>
                {typeof field.value === "string" && field.value ? (
                  <div className="relative w-24 h-24 mb-2">
                    <img
                      src={field.value}
                      alt="Stream Link"
                      className="object-cover w-full h-full rounded"
                    />
                    <Button
                      type="button"
                      onClick={() =>
                        form.setValue(`streamLinks.${index}.image`, undefined)
                      }
                      className="absolute top-0 right-0 bg-red-500 hover:bg-red-600 text-white rounded-full p-1"
                      size="sm"
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </div>
                ) : null}
                <div
                  {...getImageRootProps()}
                  className={`border-2 border-dashed p-4 rounded-lg text-center cursor-pointer ${
                    isImageDragActive ? "border-blue-500" : "border-gray-300"
                  }`}
                >
                  <input {...getImageInputProps()} />
                  {field.value instanceof File ? (
                    <p className="text-blue-600">{field.value.name}</p>
                  ) : (
                    <p>Kéo và thả file ảnh tại đây (.jpg, .jpeg, .png)</p>
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
        name={`streamLinks.${index}.commentator`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Bình luận viên (Link này)</FormLabel>
            <FormControl>
              <Input
                disabled={isLoading}
                placeholder="Ví dụ: Quang Huy"
                {...field}
              />
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
            <FormLabel>Ảnh BLV (Link này)</FormLabel>
            <FormControl>
              <div>
                {typeof field.value === "string" && field.value ? (
                  <div className="relative w-24 h-24 mb-2">
                    <img
                      src={field.value}
                      alt="Commentator"
                      className="object-cover w-full h-full rounded"
                    />
                    <Button
                      type="button"
                      onClick={() =>
                        form.setValue(
                          `streamLinks.${index}.commentatorImage`,
                          undefined
                        )
                      }
                      className="absolute top-0 right-0 bg-red-500 hover:bg-red-600 text-white rounded-full p-1"
                      size="sm"
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </div>
                ) : null}
                <div
                  {...getCommentatorImageRootProps()}
                  className={`border-2 border-dashed p-4 rounded-lg text-center cursor-pointer ${
                    isCommentatorImageDragActive
                      ? "border-blue-500"
                      : "border-gray-300"
                  }`}
                >
                  <input {...getCommentatorImageInputProps()} />
                  {field.value instanceof File ? (
                    <p className="text-blue-600">{field.value.name}</p>
                  ) : (
                    <p>Kéo và thả file ảnh tại đây (.jpg, .jpeg, .png)</p>
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
        name={`streamLinks.${index}.priority`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ưu tiên</FormLabel>
            <FormControl>
              <Input
                disabled={isLoading}
                type="number"
                min={0}
                placeholder="Số ưu tiên"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export const EditMatchModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const { match: matchToEdit } = data || {};
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
      startTime: new Date(),
      status: MatchStatusType.UPCOMING,
      scores: { homeScore: null, awayScore: null },
      mainCommentator: "",
      mainCommentatorImage: undefined,
      secondaryCommentator: "",
      secondaryCommentatorImage: undefined,
      isHot: false,
      streamLinks: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "streamLinks",
  });

  const isLoading = form.formState.isSubmitting;

  const onDropMainCommentatorImage = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles[0]) {
        form.setValue("mainCommentatorImage", acceptedFiles[0], {
          shouldValidate: true,
        });
      }
    },
    [form]
  );

  const {
    getRootProps: getMainCommentatorImageRootProps,
    getInputProps: getMainCommentatorImageInputProps,
    isDragActive: isMainCommentatorImageDragActive,
  } = useDropzone({
    onDrop: onDropMainCommentatorImage,
    accept: { "image/jpeg": [".jpg", ".jpeg"], "image/png": [".png"] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
    onDropRejected: (fileRejections) => {
      const error =
        fileRejections[0]?.errors[0]?.message || "File ảnh không hợp lệ";
      toast.error(error);
    },
  });

  const onDropSecondaryCommentatorImage = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles[0]) {
        form.setValue("secondaryCommentatorImage", acceptedFiles[0], {
          shouldValidate: true,
        });
      }
    },
    [form]
  );

  const {
    getRootProps: getSecondaryCommentatorImageRootProps,
    getInputProps: getSecondaryCommentatorImageInputProps,
    isDragActive: isSecondaryCommentatorImageDragActive,
  } = useDropzone({
    onDrop: onDropSecondaryCommentatorImage,
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

  useEffect(() => {
    if (isModalOpen && matchToEdit) {
      form.reset({
        title: matchToEdit.title || "",
        slug: matchToEdit.slug || "",
        homeTeam: matchToEdit.homeTeam?._id || "",
        awayTeam: matchToEdit.awayTeam?._id || "",
        league: matchToEdit.league?._id || "",
        sport: matchToEdit.sport?._id || "",
        startTime: matchToEdit.startTime
          ? new Date(matchToEdit.startTime)
          : new Date(),
        status: matchToEdit.status || MatchStatusType.UPCOMING,
        scores: {
          homeScore: matchToEdit.scores?.homeScore ?? null,
          awayScore: matchToEdit.scores?.awayScore ?? null,
        },
        mainCommentator: matchToEdit.mainCommentator || "",
        mainCommentatorImage: undefined,
        secondaryCommentator: matchToEdit.secondaryCommentator || "",
        secondaryCommentatorImage: undefined,
        isHot: matchToEdit.isHot || false,
        streamLinks:
          matchToEdit.streamLinks?.map((link) => ({
            label: link.label || "",
            url: link.url || "",
            image: link.image || undefined,
            commentator: link.commentator || "",
            commentatorImage: link.commentatorImage || undefined,
            priority: link.priority || 1,
          })) || [],
      });
    }
  }, [isModalOpen, matchToEdit, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (!matchToEdit?._id) {
        toast.error("Không tìm thấy ID trận đấu để cập nhật");
        return;
      }

      const homeTeamData = teams.find((t) => t._id === values.homeTeam);
      const awayTeamData = teams.find((t) => t._id === values.awayTeam);
      const leagueData = leagues.find((l) => l._id === values.league);
      const sportData = sports.find((s) => s._id === values.sport);

      if (!homeTeamData || !awayTeamData || !leagueData || !sportData) {
        toast.error("Dữ liệu đội, giải đấu hoặc môn thể thao không hợp lệ");
        return;
      }

      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("slug", values.slug);
      formData.append("homeTeam", homeTeamData._id || "");
      formData.append("awayTeam", awayTeamData._id || "");
      formData.append("league", leagueData._id || "");
      formData.append("sport", sportData._id || "");
      formData.append("startTime", values.startTime.toISOString());
      formData.append("status", values.status);

      if (
        values.scores?.homeScore !== undefined &&
        values.scores?.homeScore !== null
      ) {
        formData.append(
          "scores[homeScore]",
          values.scores.homeScore.toString()
        );
      }
      if (
        values.scores?.awayScore !== undefined &&
        values.scores?.awayScore !== null
      ) {
        formData.append(
          "scores[awayScore]",
          values.scores.awayScore.toString()
        );
      }
      if (values.isHot !== undefined) {
        formData.append("isHot", values.isHot.toString());
      }
      if (values.mainCommentator) {
        formData.append("mainCommentator", values.mainCommentator);
      }
      if (values.secondaryCommentator) {
        formData.append("secondaryCommentator", values.secondaryCommentator);
      }
      if (values.mainCommentatorImage instanceof File) {
        formData.append("mainCommentatorImage", values.mainCommentatorImage);
      } else if (
        !values.mainCommentatorImage &&
        matchToEdit.mainCommentatorImage
      ) {
        formData.append("mainCommentatorImage", "");
      }
      if (values.secondaryCommentatorImage instanceof File) {
        formData.append(
          "secondaryCommentatorImage",
          values.secondaryCommentatorImage
        );
      } else if (
        !values.secondaryCommentatorImage &&
        matchToEdit.secondaryCommentatorImage
      ) {
        formData.append("secondaryCommentatorImage", "");
      }

      const validStreamLinks =
        values.streamLinks?.filter((link) => link.label && link.url) || [];
      const processedLinks = validStreamLinks.map((link, index) => ({
        label: link.label,
        url: link.url,
        image:
          link.image instanceof File
            ? `file:image-${index}`
            : link.image || undefined,
        commentator: link.commentator || undefined,
        commentatorImage:
          link.commentatorImage instanceof File
            ? `file:commentatorImage-${index}`
            : link.commentatorImage || undefined,
        priority: link.priority || 1,
      }));

      formData.append("streamLinks", JSON.stringify(processedLinks));

      validStreamLinks.forEach((link) => {
        if (link.image instanceof File) {
          formData.append("streamLinkImages", link.image);
        }
        if (link.commentatorImage instanceof File) {
          formData.append("streamLinkCommentatorImages", link.commentatorImage);
        }
      });

      const res = await apiUpdateMatch(matchToEdit._id, formData);
      if (res?.data) {
        toast.success(`Đã cập nhật ${values.title} thành công`);
        onClose();
        const updatedList = match?.map((item) =>
          item._id === res.data._id ? res.data : item
        );
        setMatch(updatedList);
        setSelectedPage("Matches");
        form.reset();
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Lỗi khi cập nhật trận đấu";
      toast.error(errorMessage);
      console.error(error);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const hasMainCommentatorImage =
    matchToEdit?.mainCommentatorImage &&
    typeof matchToEdit.mainCommentatorImage === "string";
  const hasSecondaryCommentatorImage =
    matchToEdit?.secondaryCommentatorImage &&
    typeof matchToEdit.secondaryCommentatorImage === "string";

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
                        type="text"
                        {...field}
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
                        type="text"
                        {...field}
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
                    <FormLabel>Đội nhà</FormLabel>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn đội nhà" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white text-black h-[220px]">
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
                    <FormLabel>Đội khách</FormLabel>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn đội khách" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white text-black h-[220px]">
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
                    <FormLabel>Giải đấu</FormLabel>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn giải đấu" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white text-black h-[220px]">
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
                name="startTime"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Thời gian bắt đầu</FormLabel>
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
                            className="w-full p-2 border rounded placeholder:text-gray"
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
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trạng thái</FormLabel>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn trạng thái" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white text-black h-[220px]">
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
                      <FormLabel>Tỉ số đội nhà</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          type="number"
                          min={0}
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value ? Number(e.target.value) : null
                            )
                          }
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
                      <FormLabel>Tỉ số đội khách</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          type="number"
                          min={0}
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value ? Number(e.target.value) : null
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="mainCommentator"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bình luận viên chính (Không bắt buộc)</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="Nhập tên bình luận viên chính"
                        type="text"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="mainCommentatorImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Ảnh bình luận viên chính (Không bắt buộc)
                    </FormLabel>
                    <FormControl>
                      <div>
                        {hasMainCommentatorImage && !field.value ? (
                          <div className="relative w-24 h-24 rounded-full overflow-hidden mb-2">
                            <img
                              src={matchToEdit.mainCommentatorImage}
                              alt="Main Commentator"
                              className="object-cover w-full h-full"
                            />
                            <Button
                              type="button"
                              onClick={() =>
                                form.setValue("mainCommentatorImage", undefined)
                              }
                              className="absolute top-0 right-0 bg-red-500 hover:bg-red-600 text-white rounded-full p-1"
                              size="sm"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : null}
                        <div
                          {...getMainCommentatorImageRootProps()}
                          className={`border-2 border-dashed p-4 rounded-lg text-center cursor-pointer ${
                            isMainCommentatorImageDragActive
                              ? "border-blue-500"
                              : "border-gray-300"
                          }`}
                        >
                          <input {...getMainCommentatorImageInputProps()} />
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
                name="secondaryCommentator"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bình luận viên phụ (Không bắt buộc)</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="Nhập tên bình luận viên phụ"
                        type="text"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="secondaryCommentatorImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Ảnh bình luận viên phụ (Không bắt buộc)
                    </FormLabel>
                    <FormControl>
                      <div>
                        {hasSecondaryCommentatorImage && !field.value ? (
                          <div className="relative w-24 h-24 rounded-full overflow-hidden mb-2">
                            <img
                              src={matchToEdit.secondaryCommentatorImage}
                              alt="Secondary Commentator"
                              className="object-cover w-full h-full"
                            />
                            <Button
                              type="button"
                              onClick={() =>
                                form.setValue(
                                  "secondaryCommentatorImage",
                                  undefined
                                )
                              }
                              className="absolute top-0 right-0 bg-red-500 hover:bg-red-600 text-white rounded-full p-1"
                              size="sm"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : null}
                        <div
                          {...getSecondaryCommentatorImageRootProps()}
                          className={`border-2 border-dashed p-4 rounded-lg text-center cursor-pointer ${
                            isSecondaryCommentatorImageDragActive
                              ? "border-blue-500"
                              : "border-gray-300"
                          }`}
                        >
                          <input
                            {...getSecondaryCommentatorImageInputProps()}
                          />
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
                    <FormLabel>Trận đấu Hot</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="space-y-4 border p-4 rounded-lg">
                <h3 className="text-lg font-semibold">
                  Liên kết stream (Không bắt buộc)
                </h3>
                {fields.map((item, index) => (
                  <StreamLinkField
                    key={item.id}
                    index={index}
                    form={form}
                    remove={remove}
                    isLoading={isLoading}
                  />
                ))}
                <Button
                  type="button"
                  onClick={() =>
                    append({
                      label: "",
                      url: "",
                      image: undefined,
                      commentator: "",
                      commentatorImage: undefined,
                      priority: 1,
                    })
                  }
                  className="flex items-center gap-2 mt-4 bg-blue-500 hover:bg-blue-600"
                  disabled={isLoading}
                >
                  <PlusCircle className="h-4 w-4" /> Thêm liên kết stream
                </Button>
              </div>
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button
                onClick={handleClose}
                className="text-black rounded-[4px]"
                type="button"
                disabled={isLoading}
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

export default EditMatchModal;
