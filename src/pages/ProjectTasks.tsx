import { useParams } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import TaskManager from "@/components/tasks/TaskManager";
import { useAppContext } from "@/contexts/AppContext";

export default function ProjectTasks() {
  const { projectId } = useParams();
  const { user } = useAppContext();

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-6">
        <TaskManager 
          projectId={projectId} 
          userRole={user?.role}
        />
      </div>
    </AppLayout>
  );
}