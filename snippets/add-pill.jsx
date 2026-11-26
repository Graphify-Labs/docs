export const AddPill = ({ href, label, logo, logoDark }) => (
  <p className="not-prose my-5">
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-full border border-[#e4e4e7] bg-[#f4f4f5] px-3.5 py-1.5 text-sm font-medium leading-5 text-[#171717] no-underline !border-b-[#e4e4e7] transition-colors hover:bg-[#ececee] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#737373] dark:border-[#3a3a3c] dark:bg-[#2a2a2c] dark:text-[#fafafa] dark:!border-b-[#3a3a3c] dark:hover:bg-[#343436]"
    >
      {logo ? (
        logoDark ? (
          <>
            <img src={logo} alt="" width="16" height="16" className="m-0 h-4 w-4 object-contain dark:hidden" noZoom />
            <img src={logoDark} alt="" width="16" height="16" className="m-0 hidden h-4 w-4 object-contain dark:block" noZoom />
          </>
        ) : (
          <img src={logo} alt="" width="16" height="16" className="m-0 h-4 w-4 object-contain" noZoom />
        )
      ) : null}
      {label}
      <span aria-hidden="true">↗</span>
    </a>
  </p>
);
