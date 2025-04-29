
import {KanbanBoard} from "@/components/Tasks/KanbanBoard";
import { TabularView } from "@/components/Tasks/TabularView";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


const Tasks = () => {
  return (
    <div className="container mx-auto py-6">
     
      
      <Tabs defaultValue="tabular">
        <TabsList>
          <TabsTrigger value="tabular">Tabular View</TabsTrigger>
          <TabsTrigger value="kanban">Kanban Board</TabsTrigger>
        </TabsList>
        <TabsContent value="tabular">
          <TabularView />
        </TabsContent>
        <TabsContent value="kanban">
          <KanbanBoard />
        </TabsContent>
      </Tabs>
    </div>
  );
};
export default Tasks;
