import { FormEvent } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import {
  ArrowRightOnRectangleIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/solid'
import useStore from '../store'
import { useQueryTasks } from '../hooks/useQueryTasks'
import { useMutateTask } from '../hooks/useMutateTask'
import { useMutateAuth } from '../hooks/useMutateAuth'
import { TaskItem } from './TaskItem'

export const Todo = () => {
  const queryClient = useQueryClient()
  const { editedTask } = useStore()
  const updateTask = useStore((state) => state.updateEditedTask)
  const { data, isLoading } = useQueryTasks()
  const { createTaskMutation, updateTaskMutation } = useMutateTask()
  const { logoutMutation } = useMutateAuth()
  const submitTaskHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (editedTask.id === 0)
      createTaskMutation.mutate({
        title: editedTask.title,
      })
    else {
      updateTaskMutation.mutate(editedTask)
    }
  }
  const logout = async () => {
    await logoutMutation.mutateAsync()
    queryClient.removeQueries(['tasks'])
  }
  return (
    <div className="flex flex-col p-5 font-mono text-gray-600">
      <div className="flex items-center">
        <ArrowRightOnRectangleIcon
          onClick={logout}
          className="w-6 text-blue-500 cursor-pointer"
        />
        ログアウト
      </div>

      <div className="flex flex-col items-center">
        <div className="flex my-3 ">
          <ShieldCheckIcon className="w-8 h-8 mr-3 text-indigo-500 cursor-pointer" />
          <span className="text-3xl font-extrabold text-center">
            Task Manager
          </span>
        </div>
        <form onSubmit={submitTaskHandler}>
          <input
            className="px-3 py-2 mb-3 mr-3 border border-gray-300"
            placeholder="title ?"
            type="text"
            onChange={(e) =>
              updateTask({ ...editedTask, title: e.target.value })
            }
            value={editedTask.title || ''}
          />
          <button
            className="px-3 py-2 mx-3 text-white bg-indigo-600 rounded disabled:opacity-40"
            disabled={!editedTask.title}
          >
            {editedTask.id === 0 ? 'Create' : 'Update'}
          </button>
        </form>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <ul className="my-5">
            {data?.map((task) => (
              <TaskItem key={task.id} id={task.id} title={task.title} />
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
