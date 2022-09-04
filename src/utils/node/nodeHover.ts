export let canUseHover = false

export const toggleHover = () => {
	canUseHover = !canUseHover
}

export const runNodeHover = (cy: any) => {
	// HOVER NODE LISTENER
	const hoverSwitch = document?.getElementById(
		"hover-switch"
	) as HTMLInputElement

	let canUseHover = hoverSwitch.checked
	hoverSwitch.onchange = () => {
		canUseHover = hoverSwitch.checked
	}

	// HOVER OVER NODE EVENT
	cy.on("mouseover", "node", function (event: any) {
		if (canUseHover) {
			event.target.popperRefObj = event.target.popper({
				content: () => {
					const content = document.createElement("div")

					content.classList.add(
						"relative",
						"bg-zinc-700",
						"text-white",
						"rounded",
						"text-sm",
						"outline-none",
						"py-1",
						"px-2",
						"max-w-[200px]",
						"break-words"
					)

					const nodeData = event.target.data()

					content.innerHTML = `
              <h3>${nodeData.label}</h3>
              <p>Id: ${nodeData.id}</p>
              <p>Path: ${nodeData.fullPath}</p>
            `

					document.body.appendChild(content)
					return content
				}
			})
		}
	})

	// HOVER OUT NODE EVENT
	cy.on("mouseout", "node", function (event: any) {
		if (canUseHover && event.target.popper) {
			event.target.popperRefObj.state.elements.popper.remove()
			event.target.popperRefObj.destroy()
		}
	})
}
