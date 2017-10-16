import React from 'react';
import PropTypes from 'prop-types';
import {Row, Col, Tooltip} from 'reactstrap';

import NoImageAvailable from 'Public/img/no-image-available.png';
import ImageLoading from 'Public/img/loading.gif';

// Apis
import AttachmentApi from 'Api/upload/attachment';

export class AttachmentImage extends React.Component {
  constructor (props) {
    super(props);

    this.defaultImage = this.props.defaultImage || NoImageAvailable;

    this.state = {
      imageSource: this.defaultImage
    };
  }

  componentDidMount () {
    this.handleLoadImage(this.props);
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.imageSource && nextProps.imageSource !== this.props.imageSource) {
      this.handleLoadImage(nextProps);
    }
  }

  handleLoadImage = (props) => {
    if (props.imageSource) {
      let image = new Image();
      image.src = props.imageSource;

      image.onerror = () => {
        this.setState({
          imageSource: this.defaultImage
        });
      };
      image.oninvalid = () => {
        this.setState({
          imageSource: this.defaultImage
        });
      };
      image.onload = () => {
        this.setState({
          imageSource: props.imageSource
        })
      }; 
    }
  }

  render () {
    let style = this.props.style || {};
    let width = this.props.width || 'auto';
    let height = this.props.height || 'auto';
    let className = this.props.className || '';
    let imageSource = this.state.imageSource || '';

    return <img src={imageSource} className={className} width={width} height={height} style={style} />
  }
}

AttachmentImage.PropTypes = {
  style: PropTypes.object,
  width: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  height: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  className: PropTypes.string,
  imageSource: PropTypes.string.isRequired,
}

export class AttachmentBackgroundImage extends Component {
  constructor (props) {
    super(props);

    this.defaultImage = this.props.defaultImage || ImageLoading;

    this.state = {
      imageSource: this.defaultImage,
    }
  }

  componentDidMount = () => {
    this.handleLoadImage(this.props);
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.imageSource && nextProps.imageSource !== this.props.imageSource) {
      this.handleLoadImage(nextProps);
    }
  }

  handleLoadImage = (props) => {
    let image = new Image();
    image.src = props.imageSource;
    image.onerror = () => {
      this.setState({
        imageSource: NoImageAvailable
      });
    };
    image.oninvalid = () => {
      this.setState({
        imageSource: NoImageAvailable
      });
    };
    image.onload = () => {
      this.setState({
        imageSource: props.imageSource
      })
    };
  }

  render () {
    return (
      <div className="attachmentImage" style={{backgroundImage: `url(${this.state.imageSource})`}} />
    );
  }
}

AttachmentBackgroundImage.PropTypes = {
  className: PropTypes.string,
  defaultImage: PropTypes.string,
  imageSource: PropTypes.string.isRequired,
}

export class ViewAttachment extends Component {
  constructor (props) {
    super(props);

    this.state = {
      isOpenTooltip: false
    }
  }

  toggleTooltip = () => {
    return this.setState({
      isOpenTooltip: !this.state.isOpenTooltip
    });
  }

  render () {
    let attachmentId = this.props.attachmentId;
    let attachmentThumbUrl = AttachmentApi.getImage({
      id: attachmentId, version: 320
    });
    let attachmentOriginalUrl = AttachmentApi.getImage({
      id: attachmentId, version: 'original'
    });
    let elementId = `block_attachment_preview_${attachmentId}`;
    let isEnableTooltip = this.props.isEnableTooltip || false;

    return (
      <div>
        <a href={attachmentOriginalUrl} target="_blank" id={elementId}>
          <AttachmentBackgroundImage imageSource={attachmentThumbUrl} />
        </a>
        {this.props.isEnableTooltip && (
          <Tooltip placement="top" isOpen={this.state.isOpenTooltip} toggle={this.toggleTooltip} target={elementId}>
            Nhấn vào để tải về!
          </Tooltip>
        )}
      </div>
    );
  }
} 

ViewAttachment.PropTypes = {
  attachmentId: PropTypes.string.isRequired,
  isEnableTooltip: PropTypes.bool,
}

export class ViewAttachments extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    let attachmentIds = this.props.attachmentIds || [];
    let attachmentComponent = attachmentIds.map(attachmentId => {
      return (
        <Col xs={6} sm={3} md={2} lg={2} className="attachment" key={`block_attachment_preview_${attachmentId}`}>
          <ViewAttachment attachmentId={attachmentId} isEnableTooltip={true} />
        </Col>
      );
    });

    return (
      <div className="attachmentPreview">
        <Row>{attachmentComponent}</Row>
      </div>
    )
  }
}

ViewAttachments.PropTypes = {
  attachmentIds: PropTypes.array.isRequired
};

