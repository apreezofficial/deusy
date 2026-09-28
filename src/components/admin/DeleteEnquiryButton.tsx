"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deleteEnquiry } from "@/lib/actions/enquiry-status";
import { voidAction } from "@/lib/actions/form-action";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { useToast } from "@/components/ui/Toast";

interface DeleteEnquiryButtonProps {
  id: string;
  name: string;
}

export function DeleteEnquiryButton({ id, name }: DeleteEnquiryButtonProps) {
  const [open, setOpen] = useState(false);
  const { notify } = useToast();
  const router = useRouter();

  const remove = async (formData: FormData) => {
    const result = await deleteEnquiry(formData);

    if (!result.ok) {
      notify(result.error, "error");
      return;
    }

    notify("Enquiry deleted");
    setOpen(false);
    router.push("/admin/enquiries");
    router.refresh();
  };

  return (
    <>
      <Button variant="danger" onClick={() => setOpen(true)}>
        <Trash2 size={16} aria-hidden="true" />
        Delete enquiry
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Delete this enquiry?"
        description={`The message from ${name} will be permanently removed. This cannot be undone.`}
        footer={
          <>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Keep enquiry
            </Button>
            <form action={voidAction(remove)}>
              <input type="hidden" name="id" value={id} />
              <Button type="submit" variant="danger">
                Delete enquiry
              </Button>
            </form>
          </>
        }
      >
        <p>If you only want it out of the way, archive it instead.</p>
      </Dialog>
    </>
  );
}
