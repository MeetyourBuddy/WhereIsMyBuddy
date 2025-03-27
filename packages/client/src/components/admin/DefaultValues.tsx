
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult
} from 'react-beautiful-dnd';
import { 
  GripVertical, 
  Plus, 
  Pencil, 
  Trash, 
  X, 
  Save,
  ChevronUp,
  ChevronDown
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Mock data for system default values
interface SkillGroup {
  id: string;
  name: string;
  skills: Skill[];
  isExpanded?: boolean;
}

interface Skill {
  id: string;
  name: string;
}

const initialSkillGroups: SkillGroup[] = [
  {
    id: "sg1",
    name: "Sports",
    skills: [
      { id: "s1", name: "Basketball" },
      { id: "s2", name: "Soccer" },
      { id: "s3", name: "Tennis" },
      { id: "s4", name: "Swimming" },
      { id: "s5", name: "Running" },
    ],
    isExpanded: true
  },
  {
    id: "sg2",
    name: "Academics",
    skills: [
      { id: "s6", name: "Mathematics" },
      { id: "s7", name: "Science" },
      { id: "s8", name: "Literature" },
      { id: "s9", name: "History" },
      { id: "s10", name: "Programming" },
    ]
  },
  {
    id: "sg3",
    name: "Arts",
    skills: [
      { id: "s11", name: "Painting" },
      { id: "s12", name: "Photography" },
      { id: "s13", name: "Music" },
      { id: "s14", name: "Dancing" },
      { id: "s15", name: "Sculpture" },
    ]
  },
  {
    id: "sg4",
    name: "Languages",
    skills: [
      { id: "s16", name: "English" },
      { id: "s17", name: "Spanish" },
      { id: "s18", name: "French" },
      { id: "s19", name: "German" },
      { id: "s20", name: "Mandarin" },
    ]
  },
];

const initialActivityTypes = [
  { id: "at1", name: "Study Group" },
  { id: "at2", name: "Sports Practice" },
  { id: "at3", name: "Casual Meetup" },
  { id: "at4", name: "Workshop" },
  { id: "at5", name: "Event" },
];

const DefaultValues = () => {
  const { toast } = useToast();
  const [skillGroups, setSkillGroups] = useState<SkillGroup[]>(initialSkillGroups);
  const [activityTypes, setActivityTypes] = useState(initialActivityTypes);
  const [isAddingSkillGroup, setIsAddingSkillGroup] = useState(false);
  const [newSkillGroup, setNewSkillGroup] = useState("");
  const [isEditingSkillGroup, setIsEditingSkillGroup] = useState<string | null>(null);
  const [editedSkillGroupName, setEditedSkillGroupName] = useState("");
  
  const [isAddingSkill, setIsAddingSkill] = useState<string | null>(null);
  const [newSkill, setNewSkill] = useState("");
  const [isEditingSkill, setIsEditingSkill] = useState<{groupId: string, skillId: string} | null>(null);
  const [editedSkillName, setEditedSkillName] = useState("");
  
  const [isAddingActivityType, setIsAddingActivityType] = useState(false);
  const [newActivityType, setNewActivityType] = useState("");
  const [isEditingActivityType, setIsEditingActivityType] = useState<string | null>(null);
  const [editedActivityType, setEditedActivityType] = useState("");
  
  // Handle skill group expansion
  const toggleSkillGroupExpansion = (groupId: string) => {
    setSkillGroups(prevGroups => 
      prevGroups.map(group => 
        group.id === groupId 
          ? { ...group, isExpanded: !group.isExpanded } 
          : group
      )
    );
  };
  
  // Add a new skill group
  const handleAddSkillGroup = () => {
    if (newSkillGroup.trim() === "") return;
    
    const newId = `sg${Date.now()}`;
    setSkillGroups([
      ...skillGroups,
      {
        id: newId,
        name: newSkillGroup,
        skills: [],
        isExpanded: true
      }
    ]);
    
    setNewSkillGroup("");
    setIsAddingSkillGroup(false);
    
    toast({
      title: "Skill Group Added",
      description: `"${newSkillGroup}" has been added to skill groups.`,
    });
  };
  
  // Edit a skill group
  const handleEditSkillGroup = (groupId: string) => {
    if (editedSkillGroupName.trim() === "") return;
    
    setSkillGroups(prevGroups => 
      prevGroups.map(group => 
        group.id === groupId 
          ? { ...group, name: editedSkillGroupName } 
          : group
      )
    );
    
    setIsEditingSkillGroup(null);
    setEditedSkillGroupName("");
    
    toast({
      title: "Skill Group Updated",
      description: "The skill group has been renamed.",
    });
  };
  
  // Delete a skill group
  const handleDeleteSkillGroup = (groupId: string) => {
    const groupToDelete = skillGroups.find(group => group.id === groupId);
    
    setSkillGroups(prevGroups => 
      prevGroups.filter(group => group.id !== groupId)
    );
    
    toast({
      title: "Skill Group Deleted",
      description: `"${groupToDelete?.name}" and all its skills have been deleted.`,
    });
  };
  
  // Add a new skill to a group
  const handleAddSkill = (groupId: string) => {
    if (newSkill.trim() === "") return;
    
    setSkillGroups(prevGroups => 
      prevGroups.map(group => 
        group.id === groupId 
          ? { 
              ...group, 
              skills: [...group.skills, { id: `s${Date.now()}`, name: newSkill }]
            } 
          : group
      )
    );
    
    setNewSkill("");
    setIsAddingSkill(null);
    
    toast({
      title: "Skill Added",
      description: `"${newSkill}" has been added to the skill list.`,
    });
  };
  
  // Edit a skill
  const handleEditSkill = () => {
    if (!isEditingSkill || editedSkillName.trim() === "") return;
    
    setSkillGroups(prevGroups => 
      prevGroups.map(group => 
        group.id === isEditingSkill.groupId 
          ? { 
              ...group, 
              skills: group.skills.map(skill => 
                skill.id === isEditingSkill.skillId 
                  ? { ...skill, name: editedSkillName } 
                  : skill
              )
            } 
          : group
      )
    );
    
    setIsEditingSkill(null);
    setEditedSkillName("");
    
    toast({
      title: "Skill Updated",
      description: "The skill has been renamed.",
    });
  };
  
  // Delete a skill
  const handleDeleteSkill = (groupId: string, skillId: string) => {
    const group = skillGroups.find(g => g.id === groupId);
    const skill = group?.skills.find(s => s.id === skillId);
    
    setSkillGroups(prevGroups => 
      prevGroups.map(group => 
        group.id === groupId 
          ? { 
              ...group, 
              skills: group.skills.filter(skill => skill.id !== skillId)
            } 
          : group
      )
    );
    
    toast({
      title: "Skill Deleted",
      description: `"${skill?.name}" has been deleted.`,
    });
  };
  
  // Handle activity type functions
  const handleAddActivityType = () => {
    if (newActivityType.trim() === "") return;
    
    setActivityTypes([
      ...activityTypes,
      { id: `at${Date.now()}`, name: newActivityType }
    ]);
    
    setNewActivityType("");
    setIsAddingActivityType(false);
    
    toast({
      title: "Activity Type Added",
      description: `"${newActivityType}" has been added to activity types.`,
    });
  };
  
  const handleEditActivityType = (id: string) => {
    if (editedActivityType.trim() === "") return;
    
    setActivityTypes(prevTypes => 
      prevTypes.map(type => 
        type.id === id 
          ? { ...type, name: editedActivityType } 
          : type
      )
    );
    
    setIsEditingActivityType(null);
    setEditedActivityType("");
    
    toast({
      title: "Activity Type Updated",
      description: "The activity type has been renamed.",
    });
  };
  
  const handleDeleteActivityType = (id: string) => {
    const typeToDelete = activityTypes.find(type => type.id === id);
    
    setActivityTypes(prevTypes => 
      prevTypes.filter(type => type.id !== id)
    );
    
    toast({
      title: "Activity Type Deleted",
      description: `"${typeToDelete?.name}" has been deleted.`,
    });
  };
  
  // Handle drag and drop for skill groups
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const { source, destination, type } = result;
    
    // Handle skill group reordering
    if (type === 'skillGroup') {
      const reorderedGroups = [...skillGroups];
      const [removed] = reorderedGroups.splice(source.index, 1);
      reorderedGroups.splice(destination.index, 0, removed);
      
      setSkillGroups(reorderedGroups);
      return;
    }
    
    // Handle skill reordering within groups
    if (type === 'skill') {
      const groupId = source.droppableId;
      const groupIndex = skillGroups.findIndex(g => g.id === groupId);
      
      if (groupIndex !== -1) {
        const groupCopy = { ...skillGroups[groupIndex] };
        const skillsCopy = [...groupCopy.skills];
        
        const [removed] = skillsCopy.splice(source.index, 1);
        skillsCopy.splice(destination.index, 0, removed);
        
        groupCopy.skills = skillsCopy;
        
        const updatedGroups = [...skillGroups];
        updatedGroups[groupIndex] = groupCopy;
        
        setSkillGroups(updatedGroups);
      }
    }
    
    // Handle activity type reordering
    if (type === 'activityType') {
      const reorderedTypes = [...activityTypes];
      const [removed] = reorderedTypes.splice(source.index, 1);
      reorderedTypes.splice(destination.index, 0, removed);
      
      setActivityTypes(reorderedTypes);
    }
  };
  
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="space-y-8 animate-fade-in">
        {/* Skill Groups & Skills */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Skill Groups & Skills</CardTitle>
                <CardDescription>Manage skill categories and individual skills</CardDescription>
              </div>
              <Button onClick={() => setIsAddingSkillGroup(true)} variant="outline" size="sm">
                <Plus size={16} className="mr-1" /> Add Skill Group
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            {isAddingSkillGroup && (
              <div className="p-4 border-b border-gray-100 flex items-center gap-2">
                <Input
                  placeholder="New skill group name"
                  value={newSkillGroup}
                  onChange={(e) => setNewSkillGroup(e.target.value)}
                  className="max-w-xs"
                />
                <Button size="sm" onClick={handleAddSkillGroup}>
                  <Save size={16} className="mr-1" /> Save
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setIsAddingSkillGroup(false)}>
                  <X size={16} /> Cancel
                </Button>
              </div>
            )}
            
            <Droppable droppableId="skillGroups" type="skillGroup">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {skillGroups.map((group, groupIndex) => (
                    <Draggable key={group.id} draggableId={group.id} index={groupIndex}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="border-b border-gray-100 last:border-none"
                        >
                          <div className="flex items-center justify-between px-4 py-3 hover:bg-gray-50">
                            <div className="flex items-center gap-2">
                              <div {...provided.dragHandleProps}>
                                <GripVertical size={20} className="text-gray-400" />
                              </div>
                              
                              {isEditingSkillGroup === group.id ? (
                                <div className="flex items-center gap-2">
                                  <Input
                                    value={editedSkillGroupName}
                                    onChange={(e) => setEditedSkillGroupName(e.target.value)}
                                    className="max-w-xs h-8"
                                    autoFocus
                                  />
                                  <Button size="sm" onClick={() => handleEditSkillGroup(group.id)}>
                                    <Save size={16} /> Save
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    onClick={() => setIsEditingSkillGroup(null)}
                                  >
                                    <X size={16} /> Cancel
                                  </Button>
                                </div>
                              ) : (
                                <div 
                                  className="font-medium flex items-center cursor-pointer"
                                  onClick={() => toggleSkillGroupExpansion(group.id)}
                                >
                                  {group.isExpanded ? (
                                    <ChevronDown size={20} className="mr-1" />
                                  ) : (
                                    <ChevronUp size={20} className="mr-1" />
                                  )}
                                  {group.name}
                                  <Badge className="ml-2 text-xs" variant="outline">
                                    {group.skills.length}
                                  </Badge>
                                </div>
                              )}
                            </div>
                            
                            {isEditingSkillGroup !== group.id && (
                              <div className="flex items-center gap-2">
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  onClick={() => {
                                    setIsEditingSkillGroup(group.id);
                                    setEditedSkillGroupName(group.name);
                                  }}
                                >
                                  <Pencil size={16} />
                                </Button>
                                
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  className="text-red-500 hover:text-red-700"
                                  onClick={() => handleDeleteSkillGroup(group.id)}
                                >
                                  <Trash size={16} />
                                </Button>
                                
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  onClick={() => {
                                    setIsAddingSkill(group.id);
                                    if (!group.isExpanded) {
                                      toggleSkillGroupExpansion(group.id);
                                    }
                                  }}
                                >
                                  <Plus size={16} className="mr-1" /> Add Skill
                                </Button>
                              </div>
                            )}
                          </div>
                          
                          {group.isExpanded && (
                            <div className="pl-10 pr-4 pb-3 bg-gray-50">
                              {isAddingSkill === group.id && (
                                <div className="py-2 flex items-center gap-2">
                                  <Input
                                    placeholder="New skill name"
                                    value={newSkill}
                                    onChange={(e) => setNewSkill(e.target.value)}
                                    className="max-w-xs"
                                  />
                                  <Button size="sm" onClick={() => handleAddSkill(group.id)}>
                                    <Save size={16} className="mr-1" /> Save
                                  </Button>
                                  <Button size="sm" variant="ghost" onClick={() => setIsAddingSkill(null)}>
                                    <X size={16} /> Cancel
                                  </Button>
                                </div>
                              )}
                              
                              <Droppable droppableId={group.id} type="skill">
                                {(provided) => (
                                  <div 
                                    ref={provided.innerRef} 
                                    {...provided.droppableProps} 
                                    className={cn("space-y-1", { "pt-2": isAddingSkill !== group.id })}
                                  >
                                    {group.skills.length > 0 ? (
                                      group.skills.map((skill, skillIndex) => (
                                        <Draggable key={skill.id} draggableId={skill.id} index={skillIndex}>
                                          {(provided) => (
                                            <div
                                              ref={provided.innerRef}
                                              {...provided.draggableProps}
                                              className="flex items-center justify-between bg-white rounded p-2 border border-gray-100"
                                            >
                                              <div className="flex items-center gap-2">
                                                <div {...provided.dragHandleProps}>
                                                  <GripVertical size={16} className="text-gray-400" />
                                                </div>
                                                
                                                {isEditingSkill && isEditingSkill.groupId === group.id && isEditingSkill.skillId === skill.id ? (
                                                  <div className="flex items-center gap-2">
                                                    <Input
                                                      value={editedSkillName}
                                                      onChange={(e) => setEditedSkillName(e.target.value)}
                                                      className="max-w-xs h-7"
                                                      autoFocus
                                                    />
                                                    <Button size="sm" onClick={handleEditSkill}>
                                                      <Save size={14} /> Save
                                                    </Button>
                                                    <Button 
                                                      size="sm" 
                                                      variant="ghost" 
                                                      onClick={() => setIsEditingSkill(null)}
                                                    >
                                                      <X size={14} /> Cancel
                                                    </Button>
                                                  </div>
                                                ) : (
                                                  <span>{skill.name}</span>
                                                )}
                                              </div>
                                              
                                              {(!isEditingSkill || isEditingSkill.skillId !== skill.id) && (
                                                <div className="flex items-center gap-1">
                                                  <Button 
                                                    size="sm" 
                                                    variant="ghost" 
                                                    className="h-7 w-7"
                                                    onClick={() => {
                                                      setIsEditingSkill({ groupId: group.id, skillId: skill.id });
                                                      setEditedSkillName(skill.name);
                                                    }}
                                                  >
                                                    <Pencil size={14} />
                                                  </Button>
                                                  
                                                  <Button 
                                                    size="sm" 
                                                    variant="ghost" 
                                                    className="h-7 w-7 text-red-500 hover:text-red-700"
                                                    onClick={() => handleDeleteSkill(group.id, skill.id)}
                                                  >
                                                    <Trash size={14} />
                                                  </Button>
                                                </div>
                                              )}
                                            </div>
                                          )}
                                        </Draggable>
                                      ))
                                    ) : (
                                      <div className="text-gray-500 text-sm py-2">
                                        No skills in this group. Add some skills to get started.
                                      </div>
                                    )}
                                    {provided.placeholder}
                                  </div>
                                )}
                              </Droppable>
                            </div>
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </CardContent>
        </Card>
        
        {/* Activity Types */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Activity Types</CardTitle>
                <CardDescription>Manage available activity categories</CardDescription>
              </div>
              <Button onClick={() => setIsAddingActivityType(true)} variant="outline" size="sm">
                <Plus size={16} className="mr-1" /> Add Activity Type
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            {isAddingActivityType && (
              <div className="p-4 border-b border-gray-100 flex items-center gap-2">
                <Input
                  placeholder="New activity type"
                  value={newActivityType}
                  onChange={(e) => setNewActivityType(e.target.value)}
                  className="max-w-xs"
                />
                <Button size="sm" onClick={handleAddActivityType}>
                  <Save size={16} className="mr-1" /> Save
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setIsAddingActivityType(false)}>
                  <X size={16} /> Cancel
                </Button>
              </div>
            )}
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Activity Type</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              
              <TableBody>
                <Droppable droppableId="activityTypes" type="activityType">
                  {(provided) => (
                    <tbody ref={provided.innerRef} {...provided.droppableProps}>
                      {activityTypes.map((type, index) => (
                        <Draggable key={type.id} draggableId={type.id} index={index}>
                          {(provided) => (
                            <TableRow
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                            >
                              <TableCell className="w-12">
                                <div {...provided.dragHandleProps}>
                                  <GripVertical size={20} className="text-gray-400" />
                                </div>
                              </TableCell>
                              <TableCell>
                                {isEditingActivityType === type.id ? (
                                  <div className="flex items-center gap-2">
                                    <Input
                                      value={editedActivityType}
                                      onChange={(e) => setEditedActivityType(e.target.value)}
                                      className="max-w-xs"
                                      autoFocus
                                    />
                                    <Button size="sm" onClick={() => handleEditActivityType(type.id)}>
                                      <Save size={16} /> Save
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="ghost" 
                                      onClick={() => setIsEditingActivityType(null)}
                                    >
                                      <X size={16} /> Cancel
                                    </Button>
                                  </div>
                                ) : (
                                  type.name
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                {isEditingActivityType !== type.id && (
                                  <div className="flex items-center justify-end gap-2">
                                    <Button 
                                      size="sm" 
                                      variant="ghost" 
                                      onClick={() => {
                                        setIsEditingActivityType(type.id);
                                        setEditedActivityType(type.name);
                                      }}
                                    >
                                      <Pencil size={16} />
                                    </Button>
                                    
                                    <Button 
                                      size="sm" 
                                      variant="ghost" 
                                      className="text-red-500 hover:text-red-700"
                                      onClick={() => handleDeleteActivityType(type.id)}
                                    >
                                      <Trash size={16} />
                                    </Button>
                                  </div>
                                )}
                              </TableCell>
                            </TableRow>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </tbody>
                  )}
                </Droppable>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DragDropContext>
  );
};

export default DefaultValues;
