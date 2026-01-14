"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  FolderTree,
  BookOpen,
  FileText,
  Tag,
  Plus,
  Edit,
  Trash2,
  Loader2,
  Save,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getExamCategories,
  createExamCategory,
  updateExamCategory,
  deleteExamCategory,
  getAllExams,
  createExam,
  updateExam,
  deleteExam,
  getAllSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
  getAllTopics,
  createTopic,
  updateTopic,
  deleteTopic,
} from "@/lib/actions/admin";

function ManageContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(
    searchParams.get("tab") || "categories"
  );
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Data states
  const [categories, setCategories] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [topics, setTopics] = useState<any[]>([]);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [deleteItem, setDeleteItem] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    slug: "",
    categoryId: "",
    examId: "",
    subjectId: "",
    imageUrl: "",
  });

  useEffect(() => {
    loadAllData();
  }, []);

  async function loadAllData() {
    setIsLoading(true);
    try {
      const [categoriesData, examsData, subjectsData, topicsData] =
        await Promise.all([
          getExamCategories(),
          getAllExams(),
          getAllSubjects(),
          getAllTopics(),
        ]);
      setCategories(categoriesData || []);
      setExams(examsData || []);
      setSubjects(subjectsData || []);
      setTopics(topicsData || []);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      slug: "",
      categoryId: "",
      examId: "",
      subjectId: "",
      imageUrl: "",
    });
  };

  const handleAdd = () => {
    resetForm();
    setShowAddModal(true);
  };

  const handleEdit = (item: any) => {
    setEditItem(item);
    setFormData({
      name: item.name || "",
      description: item.description || "",
      slug: item.slug || "",
      categoryId: item.category_id || "",
      examId: item.exam_id || "",
      subjectId: item.subject_id || "",
      imageUrl: item.image_url || "",
    });
    setShowEditModal(true);
  };

  const handleDelete = (item: any) => {
    setDeleteItem(item);
    setShowDeleteModal(true);
  };

  const handleSubmitAdd = async () => {
    setIsSubmitting(true);
    try {
      let result;
      switch (activeTab) {
        case "categories":
          result = await createExamCategory({
            name: formData.name,
            description: formData.description,
            slug:
              formData.slug || formData.name.toLowerCase().replace(/\s+/g, "-"),
            image_url: formData.imageUrl,
          });
          break;
        case "exams":
          result = await createExam(
            formData.name,
            formData.description,
            formData.categoryId || undefined
          );
          break;
        case "subjects":
          result = await createSubject(formData.name, formData.examId);
          break;
        case "topics":
          result = await createTopic(formData.name, formData.subjectId);
          break;
      }

      if (result?.success) {
        await loadAllData();
        setShowAddModal(false);
        resetForm();
      }
    } catch (error) {
      console.error("Error creating:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitEdit = async () => {
    if (!editItem) return;
    setIsSubmitting(true);
    try {
      let result;
      switch (activeTab) {
        case "categories":
          result = await updateExamCategory(editItem.id, {
            name: formData.name,
            description: formData.description,
            slug: formData.slug,
            image_url: formData.imageUrl,
          });
          break;
        case "exams":
          result = await updateExam(editItem.id, {
            name: formData.name,
            description: formData.description,
            category_id: formData.categoryId || null,
          });
          break;
        case "subjects":
          result = await updateSubject(editItem.id, {
            name: formData.name,
            exam_id: formData.examId,
          });
          break;
        case "topics":
          result = await updateTopic(editItem.id, {
            name: formData.name,
            subject_id: formData.subjectId,
          });
          break;
      }

      if (result?.success) {
        await loadAllData();
        setShowEditModal(false);
        setEditItem(null);
        resetForm();
      }
    } catch (error) {
      console.error("Error updating:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteItem) return;
    setIsSubmitting(true);
    try {
      let result;
      switch (activeTab) {
        case "categories":
          result = await deleteExamCategory(deleteItem.id);
          break;
        case "exams":
          result = await deleteExam(deleteItem.id);
          break;
        case "subjects":
          result = await deleteSubject(deleteItem.id);
          break;
        case "topics":
          result = await deleteTopic(deleteItem.id);
          break;
      }

      if (result?.success) {
        await loadAllData();
        setShowDeleteModal(false);
        setDeleteItem(null);
      }
    } catch (error) {
      console.error("Error deleting:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFilteredData = () => {
    let data: any[] = [];
    switch (activeTab) {
      case "categories":
        data = categories;
        break;
      case "exams":
        data = exams;
        break;
      case "subjects":
        data = subjects;
        break;
      case "topics":
        data = topics;
        break;
    }

    if (!searchQuery) return data;
    return data.filter(
      (item) =>
        item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filteredData = getFilteredData();

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case "categories":
        return <FolderTree className="w-4 h-4" />;
      case "exams":
        return <BookOpen className="w-4 h-4" />;
      case "subjects":
        return <FileText className="w-4 h-4" />;
      case "topics":
        return <Tag className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getTabLabel = () => {
    switch (activeTab) {
      case "categories":
        return "Exam Category";
      case "exams":
        return "Exam";
      case "subjects":
        return "Subject";
      case "topics":
        return "Topic";
      default:
        return "Item";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Manage Categories & Structure
          </h1>
          <p className="text-muted-foreground mt-1">
            Create, edit, and delete exam categories, exams, subjects, and
            topics
          </p>
        </div>
        <Button onClick={handleAdd} className="gap-2">
          <Plus className="w-4 h-4" />
          Add {getTabLabel()}
        </Button>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <div className="flex items-center justify-between gap-4">
          <TabsList>
            <TabsTrigger value="categories" className="gap-2">
              <FolderTree className="w-4 h-4" />
              Categories ({categories.length})
            </TabsTrigger>
            <TabsTrigger value="exams" className="gap-2">
              <BookOpen className="w-4 h-4" />
              Exams ({exams.length})
            </TabsTrigger>
            <TabsTrigger value="subjects" className="gap-2">
              <FileText className="w-4 h-4" />
              Subjects ({subjects.length})
            </TabsTrigger>
            <TabsTrigger value="topics" className="gap-2">
              <Tag className="w-4 h-4" />
              Topics ({topics.length})
            </TabsTrigger>
          </TabsList>

          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={`Search ${activeTab}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Categories Tab */}
        <TabsContent value="categories">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredData.map((category) => (
              <Card
                key={category.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                        <FolderTree className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {category.name}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground">
                          /{category.slug}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleEdit(category)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => handleDelete(category)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {category.description || "No description"}
                  </p>
                  <div className="mt-3 flex items-center text-xs text-muted-foreground">
                    <BookOpen className="w-3 h-3 mr-1" />
                    {
                      exams.filter((e) => e.category_id === category.id).length
                    }{" "}
                    exams
                  </div>
                </CardContent>
              </Card>
            ))}
            {filteredData.length === 0 && (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                <FolderTree className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No categories found</p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Exams Tab */}
        <TabsContent value="exams">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredData.map((exam) => {
              const category = categories.find(
                (c) => c.id === exam.category_id
              );
              return (
                <Card
                  key={exam.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                          <BookOpen className="w-6 h-6 text-accent" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{exam.name}</CardTitle>
                          {category && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <FolderTree className="w-3 h-3" />
                              {category.name}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleEdit(exam)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => handleDelete(exam)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {exam.description || "No description"}
                    </p>
                    <div className="mt-3 flex items-center text-xs text-muted-foreground">
                      <FileText className="w-3 h-3 mr-1" />
                      {
                        subjects.filter((s) => s.exam_id === exam.id).length
                      }{" "}
                      subjects
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            {filteredData.length === 0 && (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No exams found</p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Subjects Tab */}
        <TabsContent value="subjects">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredData.map((subject) => {
              const exam = exams.find((e) => e.id === subject.exam_id);
              return (
                <Card
                  key={subject.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                          <FileText className="w-6 h-6 text-amber-500" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            {subject.name}
                          </CardTitle>
                          {exam && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <BookOpen className="w-3 h-3" />
                              {exam.name}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleEdit(subject)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => handleDelete(subject)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Tag className="w-3 h-3 mr-1" />
                      {
                        topics.filter((t) => t.subject_id === subject.id).length
                      }{" "}
                      topics
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            {filteredData.length === 0 && (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No subjects found</p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Topics Tab */}
        <TabsContent value="topics">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredData.map((topic) => {
              const subject = subjects.find((s) => s.id === topic.subject_id);
              return (
                <Card
                  key={topic.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                          <Tag className="w-6 h-6 text-purple-500" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            {topic.name}
                          </CardTitle>
                          {subject && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <FileText className="w-3 h-3" />
                              {subject.name}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleEdit(topic)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => handleDelete(topic)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
            {filteredData.length === 0 && (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                <Tag className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No topics found</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary" />
              Add New {getTabLabel()}
            </DialogTitle>
            <DialogDescription>
              Fill in the details to create a new {getTabLabel().toLowerCase()}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div>
              <Label>Name *</Label>
              <Input
                placeholder={`Enter ${getTabLabel().toLowerCase()} name`}
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="mt-1"
              />
            </div>

            {activeTab === "categories" && (
              <>
                <div>
                  <Label>Slug</Label>
                  <Input
                    placeholder="e.g., haryana, ssc, railway"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Enter description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Image URL</Label>
                  <Input
                    placeholder="/images/category.jpg"
                    value={formData.imageUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, imageUrl: e.target.value })
                    }
                    className="mt-1"
                  />
                </div>
              </>
            )}

            {activeTab === "exams" && (
              <>
                <div>
                  <Label>Category</Label>
                  <Select
                    value={formData.categoryId}
                    onValueChange={(v) =>
                      setFormData({ ...formData, categoryId: v })
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Enter description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="mt-1"
                  />
                </div>
              </>
            )}

            {activeTab === "subjects" && (
              <div>
                <Label>Exam *</Label>
                <Select
                  value={formData.examId}
                  onValueChange={(v) => setFormData({ ...formData, examId: v })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select exam" />
                  </SelectTrigger>
                  <SelectContent>
                    {exams.map((exam) => (
                      <SelectItem key={exam.id} value={exam.id}>
                        {exam.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {activeTab === "topics" && (
              <div>
                <Label>Subject *</Label>
                <Select
                  value={formData.subjectId}
                  onValueChange={(v) =>
                    setFormData({ ...formData, subjectId: v })
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="outline"
              onClick={() => setShowAddModal(false)}
              className="bg-transparent"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitAdd}
              disabled={isSubmitting || !formData.name}
              className="gap-2"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Create {getTabLabel()}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5 text-primary" />
              Edit {getTabLabel()}
            </DialogTitle>
            <DialogDescription>
              Update the {getTabLabel().toLowerCase()} details
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div>
              <Label>Name *</Label>
              <Input
                placeholder={`Enter ${getTabLabel().toLowerCase()} name`}
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="mt-1"
              />
            </div>

            {activeTab === "categories" && (
              <>
                <div>
                  <Label>Slug</Label>
                  <Input
                    placeholder="e.g., haryana, ssc, railway"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Enter description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Image URL</Label>
                  <Input
                    placeholder="/images/category.jpg"
                    value={formData.imageUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, imageUrl: e.target.value })
                    }
                    className="mt-1"
                  />
                </div>
              </>
            )}

            {activeTab === "exams" && (
              <>
                <div>
                  <Label>Category</Label>
                  <Select
                    value={formData.categoryId}
                    onValueChange={(v) =>
                      setFormData({ ...formData, categoryId: v })
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Enter description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="mt-1"
                  />
                </div>
              </>
            )}

            {activeTab === "subjects" && (
              <div>
                <Label>Exam *</Label>
                <Select
                  value={formData.examId}
                  onValueChange={(v) => setFormData({ ...formData, examId: v })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select exam" />
                  </SelectTrigger>
                  <SelectContent>
                    {exams.map((exam) => (
                      <SelectItem key={exam.id} value={exam.id}>
                        {exam.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {activeTab === "topics" && (
              <div>
                <Label>Subject *</Label>
                <Select
                  value={formData.subjectId}
                  onValueChange={(v) =>
                    setFormData({ ...formData, subjectId: v })
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="outline"
              onClick={() => setShowEditModal(false)}
              className="bg-transparent"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitEdit}
              disabled={isSubmitting || !formData.name}
              className="gap-2"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="w-5 h-5" />
              Delete {getTabLabel()}
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deleteItem?.name}"? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
              className="bg-transparent"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={isSubmitting}
              className="gap-2"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function AdminManagePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      }
    >
      <ManageContent />
    </Suspense>
  );
}
