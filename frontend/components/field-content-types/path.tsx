import Link from "next/link"

interface propsPath {

  path: {
    uri: string;
    title: string;
  } | Array<{ uri: string; title: string }>;
}

export default function Path({ path}: propsPath) {
  if (Array.isArray(path)) {
    return (
      <ul className="max-w-md space-y-1 text-gray-500 dark:text-black">
        {path.map((item, index) => (
            <li key={index} className="flex items-center">
              <svg className="w-3.5 h-3.5 me-2 text-black dark:text-black flex-shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
                </svg>
              <a href={item.uri} target="_blank" rel="noopener noreferrer" className="font-medium text-dark-600 dark:text-dark-500 hover:underline">
                {item.title}
              </a>
            </li>
        ))}
      </ul>
    );
  } else {
    return (
      <div>
        <Link href={'/blog/test-field-text'} className="font-medium text-dark-600 dark:text-dark-500 hover:underline">{path.title}</Link>
      </div>
    );
  }
}
