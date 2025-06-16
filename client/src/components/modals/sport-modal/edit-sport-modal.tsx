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
import { useEffect } from "react";
import { apiUpdateSport } from "@/services/sport.services";
import { useSelectedPageContext } from "@/hooks/use-context";
import toast from "react-hot-toast";
const formSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
  slug: z.string().min(1, {
    message: "Slug is required",
  }),
  icon: z.string().min(1, {
    message: "Icon is required",
  }),
  order: z.coerce.number().min(1, { message: "Order must be non-negative" }),
});
export const EditSportModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const { sport } = data;
  const isModalOpen = isOpen && type === "editSport";
  const { setSelectedPage, sports, setSports } = useSelectedPageContext();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
      icon: "",
      order: undefined,
    },
  });
  const isLoading = form.formState.isSubmitting;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const res = await apiUpdateSport(sport?._id, values);
    if (res?.data) {
      const updatedList = sports?.map((item) =>
        item._id === res.data._id ? res.data : item
      );
      setSports(updatedList); // ✅ thay sport trong danh sách
      toast.success(`Đã cập nhật thành ${values?.name} thành công`);
      onClose();
      setSelectedPage("Sports");
    }
    form.reset();
  };
  const handleClose = () => {
    form.reset();
    onClose();
  };
  useEffect(() => {
    if (sport && isModalOpen) {
      form.reset({
        name: sport.name,
        slug: sport.slug,
        icon: sport.icon,
        order: sport.order ?? 1,
      });
    } else if (!isModalOpen) {
      form.reset({
        name: "",
        slug: "",
        icon: "",
        order: undefined,
      });
    }
  }, [isModalOpen, sport, form]);
  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Chỉnh sửa Môn thể thao
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-8 px-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Enter name"
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
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Slug
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
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
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Icon
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Enter icon"
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
                name="order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Order</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="Enter order"
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
                className="text-black rounded-[4px]"
              >
                Đóng
              </Button>
              <Button disabled={isLoading} variant="ghost">
                Cập nhật
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
