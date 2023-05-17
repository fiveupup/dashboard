import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Text,
  Title
} from '@tremor/react';
import useSWR from 'swr';
import { useState } from 'react';
import PromptForm from './form';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import PromptApi, { Prompt } from '@/api/prompts';
import Loading from '@/components/loading';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'react-hot-toast';

export default function PromptPage() {
  const { data, error, mutate, isLoading } = useSWR(`prompts`, PromptApi.list);
  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);

  const handleEdit = (prompt: Prompt) => {
    setSelectedPrompt(prompt);
    setShowFormModal(true);
  };

  const handleDelete = async (prompt: Prompt) => {
    if (!confirm(`确定要删除 ${prompt.name} 吗？`)) {
      return;
    }

    await PromptApi.delete(prompt.id!);
    mutate();
    toast.success('已删除');
  };

  const handleFormSaved = (prompt?: Prompt) => {
    mutate();
    setShowFormModal(false);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <div className="flex justify-between items-center">
        <Title>角色</Title>
        <div className="text-gray-500">
          <small>共 {data?.total || 0} 条记录</small>
        </div>
      </div>
      <div className="rounded-lg border bg-white p-6 mt-6">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell className="text-center">图标</TableHeaderCell>
              <TableHeaderCell>名称</TableHeaderCell>
              <TableHeaderCell>描述</TableHeaderCell>
              <TableHeaderCell className="text-center">操作</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.data.map((prompt: Prompt) => (
              <TableRow key={prompt.id}>
                <TableCell className="flex items-center justify-center">
                  <Avatar onClick={() => handleEdit(prompt)}>
                    <AvatarFallback className="text-4xl">
                      {prompt.logo || '-'}
                    </AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell onClick={() => handleEdit(prompt)}>
                  {prompt.name}
                </TableCell>
                <TableCell>
                  <Text
                    className="truncate max-w-md"
                    title={prompt.description}
                  >
                    {prompt.description}
                  </Text>
                </TableCell>
                <TableCell className="flex items-center justify-center gap-6">
                  <Button variant="light" onClick={() => handleEdit(prompt)}>
                    编辑
                  </Button>
                  <Button
                    variant="light"
                    className="text-red-500"
                    onClick={() => handleDelete(prompt)}
                  >
                    删除
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Dialog
        open={showFormModal}
        onOpenChange={(v: boolean) => setShowFormModal(v)}
      >
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>编辑</DialogTitle>
          </DialogHeader>
          <PromptForm
            prompt={selectedPrompt}
            onSaved={handleFormSaved}
            onCancel={() => setShowFormModal(false)}
          ></PromptForm>
          <DialogFooter></DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}