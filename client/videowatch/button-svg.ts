type SVGButton = () => string

const lobbySVG: SVGButton = () => {
    return `<svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linejoin="round" stroke="currentColor" xmlns="http://www.w3.org/2000/svg" class="feather">
<path d="M20 11.5H3V20.5C3 21.0523 3.44772 21.5 4 21.5H20C20.5523 21.5 21 21.0523 21 20.5V12.5C21 11.9477 20.5523 11.5 20 11.5Z" stroke="currentColor" stroke-linejoin="round"/>
<path d="M1.59998 7.40002L17.5747 1.58568C18.0937 1.39679 18.6676 1.66438 18.8565 2.18335L19.5405 4.06274C19.7294 4.58172 19.4618 5.15556 18.9428 5.34445L2.96806 11.1588L1.59998 7.40002Z" stroke="currentColor" stroke-linejoin="round"/>
<path d="M15.6954 2.26973L15.1841 6.71254" />
<path d="M11.9366 3.6378L11.4253 8.08061" />
<path d="M8.17785 5.00589L7.66654 9.4487" />
<path d="M4.41906 6.37397L3.90775 10.8168" />
</svg>`
}

const askToJoinSVG: SVGButton = () => {
    return `<svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
<path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L6.39939 20.8229C6.78393 20.72 7.19121 20.7791 7.54753 20.9565C8.88837 21.6244 10.4003 22 12 22Z" stroke="currentColor" stroke-width="1.5"/>
<path d="M16 12C16 11.1555 15.0732 10.586 13.2195 9.44695C11.3406 8.29234 10.4011 7.71504 9.70056 8.13891C9 8.56279 9 9.70853 9 12C9 14.2915 9 15.4372 9.70056 15.8611C10.4011 16.285 11.3406 15.7077 13.2195 14.5531C15.0732 13.414 16 12.8445 16 12Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
</svg>`
}

export {
    lobbySVG,
    askToJoinSVG,
}
export type {
    SVGButton
}
