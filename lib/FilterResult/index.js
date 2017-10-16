import React from 'react';
import Component from 'Component';
import PropTypes from 'prop-types';

export default class FilterResult extends Component {
  constructor (props) {
    super(props);

    this.state = {
      total: 0,
      limit: 0,
      offset: 0,
    }
  }

  componentWillReceiveProps (nextProps) {
    let updateState = {};
    if (typeof nextProps.total !== "undefined" && nextProps.total !== this.state.total) {
      updateState.total = nextProps.total;
    }
    if (typeof nextProps.limit !== "undefined" && nextProps.limit !== this.state.limit) {
      updateState.limit = nextProps.limit;
    }
    if (typeof nextProps.offset !== "undefined" && nextProps.offset !== this.state.offset) {
      updateState.offset = nextProps.offset;
    }
    return this.setState(updateState);
  }

  render () {
    if (!this.state.total || this.state.total === 0) {
      return null;
    }

    let resultFrom = this.state.offset + 1;
    let resultTo = this.state.offset + this.state.limit;
    if (resultTo > this.state.total) {
      resultTo = this.state.total;
    }

    if (resultFrom === 1 && resultTo === this.state.total) {
      return <p>Hiển thị <strong>{resultTo}</strong> kết quả được tìm thấy.</p>
    }

    if (resultFrom === resultTo) {
      return <p>Hiển thị kết quả thứ <strong>{resultFrom}</strong> trong tổng số <strong>{this.state.total}</strong> kết quả được tìm thấy.</p>;
    }

    return <p>Hiển thị từ <strong>{resultFrom}</strong> đến <strong>{resultTo}</strong> trong tổng số <strong>{this.state.total}</strong> kết quả được tìm thấy.</p>;
  }
}

FilterResult.PropTypes = {
  total: PropTypes.number.isRequired,
  limmit: PropTypes.number.isRequired,
  offset: PropTypes.number.isRequired,
};

