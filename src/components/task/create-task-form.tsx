"use client";
import { useState } from "react";
import Line from "@/components/ui/line";
import { useEventService } from "@/hooks/use-event-service";
import { useTaskService } from "@/hooks/use-task-service";
import Modal from "@/components/ui/modal";
interface CreateTaskFormProps {
  state: boolean;
  funcClickToBack: (b: boolean) => void;
  onCancel: () => void;
  onSuccess: () => void;
}

const initialTags = [
  { label: "Quan trọng", color: "#F87171", textColor: "#fff" },
  { label: "Khẩn cấp", color: "#FBBF24", textColor: "#fff" },
  { label: "Bình thường", color: "#34D399", textColor: "#fff" },
];

export default function CreateTaskForm({
  state,
  funcClickToBack,
  onCancel,
  onSuccess,
}: CreateTaskFormProps) {
  const { events, loading: loadingEvents } = useEventService();
  const { createTask, loading } = useTaskService();
  const [formData, setFormData] = useState({
    eventId: "",
    title: "",
    tags: [] as typeof initialTags,
    description: "",
    startDate: "",
    deadline: "",
    assignee: "",
    percentComplete: 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  // const [loading, setLoading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "percentComplete"
          ? Math.max(0, Math.min(100, Number(value)))
          : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleTagToggle = (tag: (typeof initialTags)[0]) => {
    setFormData((prev) => {
      const exists = prev.tags.find((t) => t.label === tag.label);
      return {
        ...prev,
        tags: exists
          ? prev.tags.filter((t) => t.label !== tag.label)
          : [...prev.tags, tag],
      };
    });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.eventId) newErrors.eventId = "Vui lòng chọn sự kiện";
    if (!formData.title.trim())
      newErrors.title = "Tiêu đề nhiệm vụ là bắt buộc";
    if (!formData.startDate) newErrors.startDate = "Ngày bắt đầu là bắt buộc";
    if (!formData.deadline) newErrors.deadline = "Hạn chót là bắt buộc";
    if (!formData.assignee.trim())
      newErrors.assignee = "Người thực hiện là bắt buộc";
    if (formData.percentComplete < 0 || formData.percentComplete > 100)
      newErrors.percentComplete = "Phần trăm hoàn thành phải từ 0 đến 100";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      await createTask({
        ...formData,
        eventId: Number(formData.eventId), // Đảm bảo eventId là số
      });
      alert("Tạo nhiệm vụ thành công!");
      onSuccess();
    } catch (error) {
      alert(
        "Tạo nhiệm vụ thất bại: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
    }
  };

  return (
    <Modal
      state={state}
      funcClickToBack={funcClickToBack}
      className="max-w-2xl min-w-4/5"
    >
      <div style={{ color: "var(--foreground)" }}>
        <div
          className="rounded-lg shadow-lg p-8"
          style={{ backgroundColor: "var(--background)" }}
        >
          <div className="flex">
            <span
              className="px-2 text-xl font-bold border-r"
              style={{
                color: "var(--foreground)",
                borderColor: "var(--sfit-gray-200)",
              }}
            >
              Thông tin nhiệm vụ
            </span>
            <span
              className="px-2 text-xl font-bold"
              style={{ color: "var(--foreground)" }}
            >
              Chi tiết
            </span>
          </div>
          <div className="flex py-5 *:m-2">
            <div
              className="flex-5 shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] p-4"
              style={{ backgroundColor: "var(--background)" }}
            >
              <form
                id="create-task-form"
                onSubmit={handleSubmit}
                className="space-y-6 flex gap-5"
                style={{ color: "var(--foreground)" }}
              >
                <div className="w-full">
                  {/* Event */}
                  <div>
                    <label
                      htmlFor="eventId"
                      className="block text-xl font-medium mb-2"
                      style={{ color: "var(--foreground)" }}
                    >
                      Chọn sự kiện *
                    </label>
                    <select
                      id="eventId"
                      name="eventId"
                      value={formData.eventId}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      style={{
                        backgroundColor: "var(--background)",
                        color: "var(--foreground)",
                        borderColor: errors.eventId
                          ? "var(--sfit-red-500)"
                          : "var(--sfit-gray-200)",
                      }}
                      disabled={loadingEvents}
                    >
                      <option value="">-- Chọn sự kiện --</option>
                      {events.map((event) => (
                        <option key={event.id} value={event.id}>
                          {event.title}
                        </option>
                      ))}
                    </select>
                    {errors.eventId && (
                      <p
                        className="mt-1 text-sm"
                        style={{ color: "var(--sfit-red-500)" }}
                      >
                        {errors.eventId}
                      </p>
                    )}
                  </div>
                  {/* Title */}
                  <div>
                    <label
                      htmlFor="title"
                      className="block text-xl font-medium mb-2"
                      style={{ color: "var(--foreground)" }}
                    >
                      Tiêu đề nhiệm vụ *
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      style={{
                        backgroundColor: "var(--background)",
                        color: "var(--foreground)",
                        borderColor: errors.title
                          ? "var(--sfit-red-500)"
                          : "var(--sfit-gray-200)",
                      }}
                      placeholder="Nhập tiêu đề nhiệm vụ"
                    />
                    {errors.title && (
                      <p
                        className="mt-1 text-sm"
                        style={{ color: "var(--sfit-red-500)" }}
                      >
                        {errors.title}
                      </p>
                    )}
                  </div>
                  {/* Tags */}
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: "var(--foreground)" }}
                    >
                      Nhãn nhiệm vụ
                    </label>
                    <div className="flex gap-2">
                      {initialTags.map((tag) => (
                        <button
                          type="button"
                          key={tag.label}
                          onClick={() => handleTagToggle(tag)}
                          className={`px-3 py-1 rounded-full text-sm font-medium border ${
                            formData.tags.find((t) => t.label === tag.label)
                              ? "border-transparent"
                              : "border-gray-300"
                          }`}
                          style={{
                            background: formData.tags.find(
                              (t) => t.label === tag.label
                            )
                              ? tag.color
                              : "var(--search-bg)",
                            color: formData.tags.find(
                              (t) => t.label === tag.label
                            )
                              ? tag.textColor
                              : "var(--foreground)",
                            borderColor: "var(--sfit-gray-200)",
                          }}
                        >
                          {tag.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Description */}
                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium mb-2"
                      style={{ color: "var(--foreground)" }}
                    >
                      Mô tả nhiệm vụ
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      style={{
                        backgroundColor: "var(--background)",
                        color: "var(--foreground)",
                        borderColor: "var(--sfit-gray-200)",
                      }}
                      placeholder="Nhập mô tả chi tiết..."
                    />
                  </div>
                </div>
                <div className="w-full">
                  {/* Start Date */}
                  <div>
                    <label
                      htmlFor="startDate"
                      className="block text-sm font-medium mb-2"
                      style={{ color: "var(--foreground)" }}
                    >
                      Ngày bắt đầu *
                    </label>
                    <input
                      type="datetime-local"
                      id="startDate"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      style={{
                        backgroundColor: "var(--background)",
                        color: "var(--foreground)",
                        borderColor: errors.startDate
                          ? "var(--sfit-red-500)"
                          : "var(--sfit-gray-200)",
                      }}
                    />
                    {errors.startDate && (
                      <p
                        className="mt-1 text-sm"
                        style={{ color: "var(--sfit-red-500)" }}
                      >
                        {errors.startDate}
                      </p>
                    )}
                  </div>

                  {/* Deadline */}
                  <div>
                    <label
                      htmlFor="deadline"
                      className="block text-sm font-medium mb-2"
                      style={{ color: "var(--foreground)" }}
                    >
                      Hạn chót *
                    </label>
                    <input
                      type="datetime-local"
                      id="deadline"
                      name="deadline"
                      value={formData.deadline}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      style={{
                        backgroundColor: "var(--background)",
                        color: "var(--foreground)",
                        borderColor: errors.deadline
                          ? "var(--sfit-red-500)"
                          : "var(--sfit-gray-200)",
                      }}
                    />
                    {errors.deadline && (
                      <p
                        className="mt-1 text-sm"
                        style={{ color: "var(--sfit-red-500)" }}
                      >
                        {errors.deadline}
                      </p>
                    )}
                  </div>
                  {/* Assignee */}
                  <div>
                    <label
                      htmlFor="assignee"
                      className="block text-sm font-medium mb-2"
                      style={{ color: "var(--foreground)" }}
                    >
                      Người thực hiện *
                    </label>
                    <input
                      type="text"
                      id="assignee"
                      name="assignee"
                      value={formData.assignee}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      style={{
                        backgroundColor: "var(--background)",
                        color: "var(--foreground)",
                        borderColor: errors.assignee
                          ? "var(--sfit-red-500)"
                          : "var(--sfit-gray-200)",
                      }}
                      placeholder="Nhập tên người thực hiện"
                    />
                    {errors.assignee && (
                      <p
                        className="mt-1 text-sm"
                        style={{ color: "var(--sfit-red-500)" }}
                      >
                        {errors.assignee}
                      </p>
                    )}
                  </div>
                  {/* Percent Complete */}
                  <div>
                    <label
                      htmlFor="percentComplete"
                      className="block text-sm font-medium mb-2"
                      style={{ color: "var(--foreground)" }}
                    >
                      Phần trăm hoàn thành (%)
                    </label>
                    <input
                      type="number"
                      id="percentComplete"
                      name="percentComplete"
                      value={formData.percentComplete}
                      onChange={handleInputChange}
                      min={0}
                      max={100}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      style={{
                        backgroundColor: "var(--background)",
                        color: "var(--foreground)",
                        borderColor: errors.percentComplete
                          ? "var(--sfit-red-500)"
                          : "var(--sfit-gray-200)",
                      }}
                      placeholder="0 - 100"
                    />
                    {errors.percentComplete && (
                      <p
                        className="mt-1 text-sm"
                        style={{ color: "var(--sfit-red-500)" }}
                      >
                        {errors.percentComplete}
                      </p>
                    )}
                  </div>
                </div>
              </form>
            </div>
            <div
              className="p-5 flex-2 shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] font-inter"
              style={{
                color: "var(--foreground)",
                backgroundColor: "var(--background)",
              }}
            >
              <div className="text-xl">Xuất bản</div>
              <Line />
              <div className="text-sm my-1">
                Tiêu đề:{" "}
                <span style={{ color: "var(--sfit-green)" }}>
                  {formData.title}
                </span>
              </div>
              <div className="text-sm my-1">
                Nhãn:{" "}
                {formData.tags.map((tag) => (
                  <span
                    key={tag.label}
                    className="inline-block px-2 py-1 rounded-full mx-1"
                    style={{ background: tag.color, color: tag.textColor }}
                  >
                    {tag.label}
                  </span>
                ))}
              </div>
              <div className="text-sm my-1">
                Người thực hiện:{" "}
                <span style={{ color: "var(--sfit-green)" }}>
                  {formData.assignee}
                </span>
              </div>
              <div className="text-sm my-1">
                Ngày bắt đầu:{" "}
                <span style={{ color: "var(--sfit-green)" }}>
                  {formData.startDate}
                </span>
              </div>
              <div className="text-sm my-1">
                Hạn chót:{" "}
                <span style={{ color: "var(--sfit-green)" }}>
                  {formData.deadline}
                </span>
              </div>
              <div className="text-sm my-1">
                Hoàn thành:{" "}
                <span style={{ color: "var(--sfit-green)" }}>
                  {formData.percentComplete}%
                </span>
              </div>
              <div className="text-sm my-1">
                Mô tả:{" "}
                <span style={{ color: "var(--sfit-green)" }}>
                  {formData.description}
                </span>
              </div>
              <Line />
              <div className="flex justify-end space-x-4 pt-6">
                <button
                  type="button"
                  onClick={onCancel}
                  className="text-sm px-4 py-2 border rounded-lg font-medium transition-colors"
                  style={{
                    borderColor: "var(--sfit-gray-200)",
                    color: "var(--foreground)",
                    backgroundColor: "var(--background)",
                  }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  form="create-task-form"
                  className="text-sm px-4 py-2 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: "var(--sfit-green)",
                    color: "var(--background)",
                  }}
                >
                  Tạo nhiệm vụ
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
