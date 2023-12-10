"use client"
import { useState } from "react"
import Row from "./tableComponents/row"
import Column from "./tableComponents/column"
import Link from "next/link"

export default function Table({ columns, on_filter_input_change, data, tableName, canADD, rowNumber, pageSize, pageNum, setData, onToggleModal }: { columns: string[], data: any[], tableName: string, canADD: boolean, rowNumber: number, pageSize: number, pageNum: number, setData: Function, onToggleModal: (tableName: string, left: number, top: number, id: number, slug: string) => void, on_filter_input_change: () => Promise<void> }) {

  const rows = data?.map((rowData, i) => <Row onToggleModal={onToggleModal} data={rowData} values={columns.map(c => ({ key: c, prop: `${rowData[c]}` }))} id={rowData.id} tableName={tableName} key={i} />)
  const [isLoading, setIsLoading] = useState(false)
  const columnsElements = columns.map((c, i) => <Column text={c} key={i} setData={setData} />)

  return (
    <>
      <div className="flex flex-col items-end justify-between gap-3 sm:flex-row sm:items-center">
        <div className="mb-7">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (isLoading) return;
              setIsLoading(true)
              on_filter_input_change().then(() => {
                setIsLoading(false)
              }).catch(() => {
                setIsLoading(false)
              })
            }}
          >


            <input type="text" className="input py-3 px-2 bg-[transparent] rounded-lg focus:outline-none border-1 placeholder:text-gray-500 text-white" placeholder="Filter..." id="filter-input" style={{ border: '1.5px solid rgba(255, 255, 255, 0.15)', fontWeight: '400' }} />
          </form>
        </div>
        <div className="flex gap-5">
          {(canADD && tableName !== 'users') && (<Link
            className="flex items-center gap-1 rounded-md border-[1px] border-black/10 bg-white px-4 py-2 text-xs font-medium transition hover:bg-black/10 dark:border-white/10 dark:bg-[#09090b] dark:hover:bg-white/10"
            href={`/dashboard/table/${tableName}/add`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-3 w-3"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            <span>Add new</span>
          </Link>)}
          {tableName == 'chapters' && (<Link
            className="flex items-center gap-1 rounded-md border-[1px] border-black/10 bg-white px-4 py-2 text-xs font-medium transition hover:bg-black/10 dark:border-white/10 dark:bg-[#09090b] dark:hover:bg-white/10"
            href={`/dashboard/table/chapters/bulkCreate`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-3 w-3"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            <span>bulk create</span>
          </Link>)}
        </div>

      </div>
      <div className="boder-black/10 overflow-hidden overflow-x-auto rounded-md border-[1px] dark:border-white/10">

        <table id='table' className="w-full p-10 pb-40">
          <thead className="bg-transparent">
            <tr className="border-b-[1px] border-black/10 dark:border-white/10">
              {columnsElements}
            </tr>
          </thead>

          <tbody className="divide-y-[1px] divide-black/10 dark:divide-white/10">
            {rows}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end">
        <nav className="flex items-center gap-5">
          <h3 className="hidden sm:block"> Page {pageNum} of {Math.ceil(rowNumber / pageSize)} </h3>
          <ul className="pagination flex gap-1">
            <li
              className="pagination-link pagination-disabled"
              aria-label="« Previous"
            >
              <a
                href={pageNum !== 1 ? `/dashboard/table/${tableName}?page=${pageNum - 1}` : '#'}
              >

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-3 w-3 block h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 19.5L8.25 12l7.5-7.5"
                  />
                </svg>
              </a>
            </li>
            <li
              className="pagination-link pagination-active"
              aria-current="page"
            >
              <span>{pageNum}</span>
            </li>
            <li
              className="pagination-link"

            >
              <a
                href={!(pageNum >= (Math.ceil(rowNumber / pageSize))) ? `/dashboard/table/${tableName}?page=${pageNum + 1}` : '#'}
              >

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-3 w-3 h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                  />
                </svg>
              </a>
            </li>
          </ul>
        </nav>
      </div>

    </>
  )
}