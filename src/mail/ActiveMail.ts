import * as PIXI from "pixi.js";
import { Graphics, Sprite, Texture } from "pixi.js";
import { Game } from "../game";

type MailType = {
	played: boolean;
	index: number;
	forceOpen: any;
	title: string;
	description: string;
	type: number;
	read?: boolean;
	identifier: string;
	salaryPaid: boolean;
};

export class ActiveMail extends PIXI.Container {
	protected mail: MailType;
	private mailHeaderIcon: PIXI.Sprite;
	public game: Game;
	protected contentContainer: PIXI.Container<PIXI.DisplayObject>;
	protected maxHeight: number;
	public progress: any;
	private scrollJump: any;
	private originalPosition: any;
	private dragging: boolean;
	private _scrollThumb: PIXI.Graphics;
	private _scrollbarPadding: number = 2;

	constructor(mail: MailType, mailHeaderIcon: PIXI.Sprite, game: Game) {
		super();
		this.x = 80;
		this.y = 35;
		// custom hitarea so you can drag outside of the container
		this.hitArea = new PIXI.Rectangle(0, 0, 800, 500);
		this.maxHeight = 435;
		this.game = game;
		this.mailHeaderIcon = mailHeaderIcon;
		this.mail = mail;
		this.contentContainer = new PIXI.Container();

		this.createTitle();
	}

	private createTitle() {
		// The content of the e-mail
		const contentIcon = this.mailHeaderIcon;
		contentIcon.scale.set(0.5);
		const contentTitle = new PIXI.Text(this.mail.title, {
			fill: "black",
			fontSize: 30,
		});
		const emailText = new PIXI.Text(
			"Van: neeldert@waterschappen.nl \nNaar: jou",
			{ fill: "black", fontSize: 14 }
		);

		// Set the position of the content relative to the content container and items inside of it
		contentIcon.position.set(this.x + 15, this.y + 10);
		contentTitle.position.set(
			this.x + 15 + contentIcon.width + 10,
			contentIcon.y + 15
		);
		emailText.position.set(
			this.x + 20,
			contentTitle.y + contentTitle.height + 15
		);

		const background = new Graphics();
		background.beginFill(0xf0f0f0);
		background.drawRect(this.x, this.y, 435, 450);
		background.endFill();
		this.addChild(background);

		// Add the content to the content container
		this.contentContainer.addChild(contentIcon, contentTitle, emailText);
		this.addChild(background, this.contentContainer);
	}

	// function for child classes to run after the content is created
	protected checkScroll() {
		// If the total height of the content is bigger than the max height, add scrolling
		if (this.contentContainer.height < this.maxHeight) return;

		// add mask
		this.contentContainer.mask = new PIXI.Graphics()
			.beginFill(0x000000)
			.drawRect(this.x, this.y + 115, 750, this.maxHeight)
			.endFill();

		// add virtical scroll bar
		const scrollBar = new PIXI.Graphics();
		scrollBar.beginFill(0x97989a);
		scrollBar.drawRect(510, this.y, 14, 450);
		scrollBar.endFill();
		this.addChild(scrollBar);

		// add progress based on height and max height
		this._scrollThumb = new PIXI.Graphics();
		this._scrollThumb.beginFill(0xd7d8d9);

		// calculate the height of the scroll thumb based on the height of the content
		const viewableRatio = 450 / (this.contentContainer.height + 50);
		const thumbHeight = 450 * viewableRatio;

		const scrollTrackSpace = this.contentContainer.height + 50 - 450;
		const scrollThumbSpace = 450 - thumbHeight;
		this.scrollJump = scrollTrackSpace / scrollThumbSpace;

		// draw the scroll thumb
		this._scrollThumb.drawRect(510 + 2, this.y, 10, thumbHeight);
		this._scrollThumb.endFill();
		this.addChild(this._scrollThumb);
		this._scrollThumb.y = 2;

		// set correct evnt mode and cursor
		this.eventMode = "static";
		this._scrollThumb.eventMode = "static";
		this._scrollThumb.cursor = "pointer";

		// on mouse down, set the original position and start dragging
		this._scrollThumb.onmousedown = (e) => {
			this.originalPosition = e.global.y;
			this.dragging = true;
		};

		this.on("mousemove", (e) => {
			if (this.dragging) {
				this.cursor = "pointer";

				// get the new position of the mouse
				const newPosition = e.global.y;

				// if the new position is outside of the bounds of the thumb
				if (
					!(
						this._scrollThumb.getBounds().y < newPosition &&
						this._scrollThumb.getBounds().y + this._scrollThumb.height >
						newPosition
					)
				)
					return;

				// get the difference between the original position and the new position
				const difference = this.originalPosition - newPosition;

				// set the original position to the new position for the next time this event is called
				this.originalPosition = e.global.y;

				// get the direction of the scroll
				const direction = difference <= 0 ? "down" : "up";

				if (direction == "up") {
					// if the progress would go out of the top bound including padding, set it to 0
					if (this._scrollThumb.y - difference <= this._scrollbarPadding) {
						this.contentContainer.y = 0;
					} else {
						// else, just scroll up
						this.contentContainer.y += this.scrollJump * difference;
						this._scrollThumb.y -= difference;
					}
				} else {
					// if it would go below the bottom bound, set it to the bounds
					if (
						this._scrollThumb.y + this._scrollThumb.height - difference >
						scrollBar.height - this._scrollbarPadding
					) {
						const left =
							scrollBar.height -
							this._scrollbarPadding -
							(this._scrollThumb.y + this._scrollThumb.height);
						this.contentContainer.y -= this.scrollJump * left;
						this._scrollThumb.y += left;
					} else {
						// else, just scroll down
						this.contentContainer.y += this.scrollJump * difference;
						this._scrollThumb.y -= difference;
					}
				}
			}
		});

		this.onmouseup = (e) => {
			this.dragging = false;
			this.cursor = "default";
		};

		this.onmouseupoutside = (e) => {
			this.dragging = false;
			this.cursor = "default";
		};

		this.onwheel = (e) => {
			const step = 35;
			const direction = e.deltaY <= 0 ? "up" : "down";

			if (direction == "up") {
				// if the progress would go above the top with padding of 2px
				if (this._scrollThumb.y - step < this._scrollbarPadding) {
					this.contentContainer.y = 0;
					this._scrollThumb.y -= this._scrollThumb.y - this._scrollbarPadding;
				} else {
					// else, just scroll up
					this.contentContainer.y += this.scrollJump * step;
					this._scrollThumb.y -= step;
				}
			} else {
				// if the progress would go below the bottom with padding of 2px
				if (
					this._scrollThumb.y + this._scrollThumb.height + step >
					scrollBar.height - this._scrollbarPadding
				) {
					const pxLeft =
						scrollBar.height -
						this._scrollbarPadding -
						(this._scrollThumb.y + this._scrollThumb.height);
					this.contentContainer.y -= this.scrollJump * pxLeft;
					this._scrollThumb.y += pxLeft;
				} else {
					// else, just scroll down
					this.contentContainer.y -= this.scrollJump * step;
					this._scrollThumb.y += step;
				}
			}
		};
	}
}
