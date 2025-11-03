// app/admin/resumes/page.tsx

"use client";

import { useState } from "react";
import { FileText, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { STATIC_RESUMES } from "@/lib/resumes";
import { ResumeDocument } from "@/lib/models";

// --- Import Placeholder Components ---
import { ResumesDataTable } from "@/components/resume/ResumesDataTable";
import { ResumeFormDialog } from "@/components/resume/ResumeFormDialog";

export default function ResumesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<
    ResumeDocument | undefined
  >(undefined);

  // Handler to open the dialog for creating a NEW document entry
  const handleCreate = () => {
    setEditingDocument(undefined);
    setIsDialogOpen(true);
  };

  // Handler to open the dialog for editing an existing document
  const handleEdit = (doc: ResumeDocument) => {
    setEditingDocument(doc);
    setIsDialogOpen(true);
  };

  return (
    <main className="flex flex-1 flex-col gap-6 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <FileText className="h-7 w-7" />
          Resume Document Manager
        </h1>
        <Button onClick={handleCreate}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Upload New Document
        </Button>
      </div>

      {/* Reusable Dialog Component for CREATE/EDIT */}
      <ResumeFormDialog
        open={isDialogOpen}
        setOpen={setIsDialogOpen}
        documentToEdit={editingDocument}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">
            Uploaded Resumes ({STATIC_RESUMES.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Render the DataTable with the static data */}
          <ResumesDataTable data={STATIC_RESUMES} onEdit={handleEdit} />
        </CardContent>
      </Card>
    </main>
  );
}
