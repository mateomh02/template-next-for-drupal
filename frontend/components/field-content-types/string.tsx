interface propString {
  valueInfo: string | string[];
  type: string
}

export default function String({ valueInfo, type }: propString) {
  // console.log(typeof valueInfo)
  const typevalueInfo = typeof valueInfo
  console.log(valueInfo)
  return (
    <>
      {typevalueInfo == "string" ? (
        type == "title" ? (
          <h1 className="mb-4 text-6xl font-black leading-tight text-center">{valueInfo}</h1>
        ) : (
          <p className="text-xl font-semibold dark:text-black">{valueInfo}</p>
        )
      ) : (
        <ul className="max-w-md space-y-1 text-gray-500 dark:text-black">
          {Array.isArray(valueInfo) &&
            valueInfo.map((item: string, index: number) => (
              <li className="flex items-center" key={index}>
                <svg className="w-3.5 h-3.5 me-2 text-black dark:text-black flex-shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
                </svg>
                {item}
              </li>
            ))
          }
        </ul>
      )}
    </>
  )
}
