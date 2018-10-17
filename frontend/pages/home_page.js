import React, { Component } from 'react';
import appRoutes from 'src/constants/routes';
import { NavLink } from 'react-router-dom';
import FormInput from 'src/frontend/components/form_input';

export default class HomePage extends Component {
  state = {
    loading: false,
    newNoteDocumentModalVisible: false,
    // noteDocs: [],
  }

  constructor(props) {
    super(props);
  }

  addNoteDoc = ({ docName }) => {
    this.hideNewNoteDocumentModal();
    this.props.addNotesDocument({ name: docName });
  }

  showNewNoteDocumentModal = () => {
    this.setState({ newNoteDocumentModalVisible: true });
  }

  hideNewNoteDocumentModal = () => {
    this.setState({ newNoteDocumentModalVisible: false });
  }

  render() {
    return (
      <div className='home-page'>
        <header className='home-page__header'>
          <div className='content'>
            <button className='green-button' onClick={this.showNewNoteDocumentModal}>
              <i className='fas fa-plus' /> New Item
            </button>
          </div>
        </header>
        <section className='home-page__docs'>

        </section>
      </div>
    );
  }
}

function Table({ children, headers, loadMore, loading }) {
  return (
    <div className='table-container'>
      <table>
        <thead>
          <tr>
            {
              headers.map((header, index) => <th key={index}>{header}</th>)
            }
          </tr>
        </thead>
        <tbody>
          { children }
        </tbody>
      </table>
      <div className='table-load-more'>
        {
          loading ? <img src='https://media.giphy.com/media/fHgQPwQdKVMAg/giphy.gif' /> :
          <span onClick={loadMore}>Load More</span>
        }
      </div>
    </div>
  );
}

function TableRow({ transactionData }) {
  const { id, name, amount, transactionType } = transactionData;

  return (
    <tr>
      <td>
        { id }
      </td>
      <td>
        { name }
      </td>
      <td>
        { amount }
      </td>
      <td>
        { transactionType }
      </td>
    </tr>
  );
}
