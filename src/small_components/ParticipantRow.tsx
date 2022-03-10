import {  ListItem, ListItemIcon, ListItemText } from '@mui/material';
import React, { Suspense } from 'react';
import { Component } from 'react';
import { VaniEvent } from 'vani-meeting-client';
import { Participant } from 'vani-meeting-client/lib/model/Participant';
import WebrtcCallHandler from '../utility/WebrtcCallHandler';
import SmallSuspense from './SmallSuspense';

const MicIcon = React.lazy(() => import('@mui/icons-material/Mic'));
const MicOffIcon = React.lazy(() => import('@mui/icons-material/MicOff'));

const VideocamIcon = React.lazy(() => import('@mui/icons-material/Videocam'));
const VideocamOffIcon = React.lazy(() => import('@mui/icons-material/VideocamOff'));
const Avatar = React.lazy(() => import('@mui/material/Avatar'));

interface ParticipantRowProps {
	t: any;
	participant: Participant;
}

interface ParticipantRowState {
	isMuted: boolean;
	isCameraOff: boolean;
}

export class ParticipantRow extends Component<ParticipantRowProps, ParticipantRowState> {
	constructor(props: ParticipantRowProps) {
		super(props);
		this.state = {
			isMuted: !props.participant.isAudioEnable,
			isCameraOff: !props.participant.isVideoEnable
		};
		this.onAudioVideoStatusUpdated = this.onAudioVideoStatusUpdated.bind(this);
	}

	componentDidMount() {
		WebrtcCallHandler.getInstance().getMeetingHandler().getEventEmitter()?.on(VaniEvent.OnAudioVideoStatusUpdated, this.onAudioVideoStatusUpdated)
	}

	componentWillUnmount()
	{
		WebrtcCallHandler.getInstance().getMeetingHandler().getEventEmitter()?.off(VaniEvent.OnAudioVideoStatusUpdated, this.onAudioVideoStatusUpdated)
	}

	onAudioVideoStatusUpdated(participant: Participant){
		if(participant.userId === this.props.participant.userId){
			this.setState({isMuted: !this.props.participant.isAudioEnable,
				isCameraOff: !this.props.participant.isVideoEnable})
		}
	}
	render() {
		return (
			<ListItem key={this.props.participant.userId}>
				<ListItemIcon>
				<Suspense fallback={<SmallSuspense />}>
					<Avatar />
					</Suspense>
				</ListItemIcon>
				<ListItemText primary={this.props.participant.userData.name} />
				<ListItemIcon className="listIcons">
					{this.state.isMuted ? (
						<Suspense fallback={<SmallSuspense />}>
							<MicOffIcon />
						</Suspense>
					) : (
						<Suspense fallback={<SmallSuspense />}>
							<MicIcon />
						</Suspense>
					)}
					{this.state.isCameraOff ? (
						<Suspense fallback={<SmallSuspense />}>
							<VideocamOffIcon />
						</Suspense>
					) : (
						<Suspense fallback={<SmallSuspense />}>
							<VideocamIcon />
						</Suspense>
					)}

					{/* <MoreHorizIcon onClick={this.props.handleClick} /> */}
				</ListItemIcon>
				{/* <MoreOptionsDialog
                    anchorEl={this.props.anchorEl}
                    handleClick={this.props.handleClick}
                    handleClose={this.props.handleClose}
                  >
                    <MenuItem>Speaker</MenuItem>
                    <MenuItem>FullScreen</MenuItem>
                    <MenuItem>Settings</MenuItem>
                  </MoreOptionsDialog> */}
			</ListItem>
		);
	}
}
