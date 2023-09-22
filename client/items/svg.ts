type SVG = () => string

const lobbySVG: SVG = () => {
    return `<svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linejoin="round" stroke="currentColor" xmlns="http://www.w3.org/2000/svg" class="feather">
<path d="M20 11.5H3V20.5C3 21.0523 3.44772 21.5 4 21.5H20C20.5523 21.5 21 21.0523 21 20.5V12.5C21 11.9477 20.5523 11.5 20 11.5Z" stroke="currentColor" stroke-linejoin="round"/>
<path d="M1.59998 7.40002L17.5747 1.58568C18.0937 1.39679 18.6676 1.66438 18.8565 2.18335L19.5405 4.06274C19.7294 4.58172 19.4618 5.15556 18.9428 5.34445L2.96806 11.1588L1.59998 7.40002Z" stroke="currentColor" stroke-linejoin="round"/>
<path d="M15.6954 2.26973L15.1841 6.71254" />
<path d="M11.9366 3.6378L11.4253 8.08061" />
<path d="M8.17785 5.00589L7.66654 9.4487" />
<path d="M4.41906 6.37397L3.90775 10.8168" />
</svg>`
}

const askToJoinSVG: SVG = () => {
    return `<svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
<path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L6.39939 20.8229C6.78393 20.72 7.19121 20.7791 7.54753 20.9565C8.88837 21.6244 10.4003 22 12 22Z" stroke="currentColor" stroke-width="1.5"/>
<path d="M16 12C16 11.1555 15.0732 10.586 13.2195 9.44695C11.3406 8.29234 10.4011 7.71504 9.70056 8.13891C9 8.56279 9 9.70853 9 12C9 14.2915 9 15.4372 9.70056 15.8611C10.4011 16.285 11.3406 15.7077 13.2195 14.5531C15.0732 13.414 16 12.8445 16 12Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
</svg>`
}

const videoJoined: SVG = () => {
    return `<svg width="24px" height="24px" viewBox="0 0 16 16" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="m 9.5 2 c -1.21875 0 -2.246094 0.898438 -2.457031 2.0625 c -0.175781 -0.042969 -0.359375 -0.0625 -0.542969 -0.0625 h -4 c -1.367188 0 -2.5 1.132812 -2.5 2.5 v 3 c 0 1.367188 1.132812 2.5 2.5 2.5 h 4 c 0.5625 0 1.082031 -0.191406 1.5 -0.511719 c 0.417969 0.320313 0.9375 0.511719 1.5 0.511719 h 4 c 1.367188 0 2.5 -1.132812 2.5 -2.5 v -5 c 0 -1.367188 -1.132812 -2.5 -2.5 -2.5 z m 0 2 h 4 c 0.292969 0 0.5 0.207031 0.5 0.5 v 5 c 0 0.292969 -0.207031 0.5 -0.5 0.5 h -4 c -0.292969 0 -0.5 -0.207031 -0.5 -0.5 v -5 c 0 -0.292969 0.207031 -0.5 0.5 -0.5 z m -7 2 h 4 c 0.292969 0 0.5 0.207031 0.5 0.5 v 3 c 0 0.292969 -0.207031 0.5 -0.5 0.5 h -4 c -0.292969 0 -0.5 -0.207031 -0.5 -0.5 v -3 c 0 -0.292969 0.207031 -0.5 0.5 -0.5 z m 0.5 7 c -0.554688 0 -1 0.445312 -1 1 h 5 c 0 -0.554688 -0.445312 -1 -1 -1 z m 7 0 c -0.554688 0 -1 0.445312 -1 1 h 5 c 0 -0.554688 -0.445312 -1 -1 -1 z m 0 0" stroke="currentColor" stroke-width="1.5"/>
</svg>`
}

const screenCast: SVG = () => {
    return `<svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
<path d="M20 18.4151C20.3136 18.2627 20.5862 18.0706 20.8284 17.8284C22 16.6569 22 14.7712 22 11C22 10.6508 22 10.3178 21.9991 10M4 18.4151C3.68645 18.2627 3.41375 18.0706 3.17157 17.8284C2 16.6569 2 14.7712 2 11C2 7.22876 2 5.34315 3.17157 4.17157C4.34315 3 6.22876 3 10 3H14C17.7712 3 19.6569 3 20.8284 4.17157C21.298 4.64118 21.5794 5.2255 21.748 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
<path d="M9.94955 16.0503C10.8806 15.1192 11.3461 14.6537 11.9209 14.6234C11.9735 14.6206 12.0261 14.6206 12.0787 14.6234C12.6535 14.6537 13.119 15.1192 14.0501 16.0503C16.0759 18.0761 17.0888 19.089 16.8053 19.963C16.7809 20.0381 16.7506 20.1112 16.7147 20.1815C16.2973 21 14.8648 21 11.9998 21C9.13482 21 7.70233 21 7.28489 20.1815C7.249 20.1112 7.21873 20.0381 7.19436 19.963C6.91078 19.089 7.92371 18.0761 9.94955 16.0503Z" stroke="currentColor" stroke-width="1.5"/>
</svg>`
}

const guestSVG: SVG  = () => {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-users"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`
}
export {
    lobbySVG,
    askToJoinSVG,
    videoJoined,
    screenCast,
    guestSVG,
}
export type {
    SVG
}
