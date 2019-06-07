import React, { Component } from 'react';
import './Dropdown.css';

class Dropdown extends Component {
  constructor(props) {
    super(props);

    this.state = {
      shouldUnderline: false,
    }
    this.setUnderline = this.setUnderline.bind(this);
  }

  setUnderline() {
    this.setState(state => ({
      shouldUnderline: !state.shouldUnderline
    }))
  }

  render() {
    const { shouldUnderline } = this.state;
    const { name, links, titles } = this.props;

    return (
      <nav className="nav">
        <ul>
            <li onMouseEnter={this.setUnderline} onMouseLeave={this.setUnderline}>
                <h3 className={`username underline${shouldUnderline ? ' hover': ''}`}>{name}</h3>
                <ul>
                    {links.map((link, i) => {
                      const title = titles[i];
                      return (
                        <li key={i}>
                          <a className='link' href={link} title={title}>
                            {title}
                          </a>
                        </li>
                      );
                    })}
                </ul>
            </li>
        </ul>
      </nav>
    );
  };
}

export default Dropdown;
