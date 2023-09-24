import type {SVG} from './svg'


interface displayButtonOptionsBase {
    buttonContainer: HTMLElement
    name: string
    label: string
    icon?: SVG
    additionalClasses?: string[]
}

interface displayButtonOptionsCallback extends displayButtonOptionsBase {
    callback: () => void | boolean
}

interface displayButtonOptionsHref extends displayButtonOptionsBase {
    href: string
    targetBlank?: boolean
}

type displayButtonOptions = displayButtonOptionsCallback | displayButtonOptionsHref

function displayButton(dbo: displayButtonOptions): void {
    const button = document.createElement('a')
    button.classList.add(
        'peertube-button-link',
        'peertube-plugin-shig-button',
        'peertube-plugin-shig-button-' + dbo.name
    )
    if (dbo.additionalClasses) {
        for (let i = 0; i < dbo.additionalClasses.length; i++) {
            button.classList.add(dbo.additionalClasses[i])
        }
    }
    if ('callback' in dbo) {
        button.onclick = dbo.callback
    }
    if ('href' in dbo) {
        button.href = dbo.href
    }
    if (('targetBlank' in dbo) && dbo.targetBlank) {
        button.target = '_blank'
    }
    if (dbo.icon) {
        try {
            const svg = dbo.icon()
            const tmp = document.createElement('span')
            tmp.innerHTML = svg.trim()
            const svgDom = tmp.firstChild
            if (svgDom) {
                button.prepend(svgDom)
            }
        } catch (err) {
            console.log('Failed to generate the ' + dbo.name + ' button: ' + (err as string))
        }

        button.setAttribute('title', dbo.label)
        button.setAttribute('ng-reflect-ngb-tooltip', dbo.label)
    } else {
        button.textContent = dbo.label
    }

    const dropdown = document.getElementsByTagName('my-video-actions-dropdown')?.item(0)
    if (dropdown) {
        dbo.buttonContainer.insertBefore(button, dropdown)
    } else {
        dbo.buttonContainer.append(button)
    }
}

export type {
    displayButtonOptions
}
export {
    displayButton
}
