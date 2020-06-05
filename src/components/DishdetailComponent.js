import React, { Component } from "react";
import {
    Card,
    CardImg,
    CardBody,
    CardText,
    CardTitle,
    Breadcrumb,
    BreadcrumbItem,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Label, Col, FormGroup
} from 'reactstrap';
import {Control, Errors, LocalForm} from 'react-redux-form';
import { Link } from 'react-router-dom';
import {addComment} from "../redux/ActionCreators";
import {Loading} from "./LoadingComponent";
import {baseUrl} from "../shared/baseUrl";
import {FadeTransform, Stagger} from "react-animation-components";

class CommentForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false
        }

        this.toggleCommentForm = this.toggleCommentForm.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    toggleCommentForm() {
        this.setState({
            isOpen: !this.state.isOpen
        })
    }

    handleSubmit(values) {
        console.log(JSON.stringify(values));
        this.props.postComment(this.props.dishId, values.rating, values.author, values.comment);
    }

    render() {

        const required = (val) => val && val.length;
        const minLength = (len) => (val) => !(val) || (val.length >= len);
        const maxLength = (len) => (val) => !(val) || (val.length <= len);

        return (
            <React.Fragment>
                <Button type="button" outline className="mb-5" onClick={this.toggleCommentForm}>
                    <span className="fa fa-pencil fa-lg" /> Submit Comment
                </Button>
                <Modal isOpen={this.state.isOpen} toggle={this.toggleCommentForm}>
                    <ModalHeader toggle={this.toggleCommentForm}>Submit Comment</ModalHeader>
                    <ModalBody>
                        <LocalForm onSubmit={(values) => this.handleSubmit(values)}>
                            <FormGroup>
                                <Label htmlFor="rating">Rating</Label>
                                <Control.select id="rating" name="rating" model=".rating" className="form-control"
                                validators={{required}}>
                                    <option disabled={true} selected={true}>Select an Option</option>
                                    <option value={1}>1</option>
                                    <option value={2}>2</option>
                                    <option value={3}>3</option>
                                    <option value={4}>4</option>
                                    <option value={5}>5</option>
                                </Control.select>
                                <Errors className="text-danger" model=".rating" show="touched"
                                        messages={{
                                            required: "Required",
                                        }}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label htmlFor="author">Your Name</Label>
                                <Control.text id="author" name="author" placeholder="Your Name"
                                              className="form-control" model=".author"
                                              validators={{required, minLength: minLength(3), maxLength: maxLength(15)}}
                                />
                                <Errors className="text-danger" model=".author" show="touched"
                                        messages={{
                                            required: "Required",
                                            maxLength: "Must be 15 characters or less",
                                            minLength: "Must be greater than 2 characters"
                                        }}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label htmlFor="comment">Comment</Label>
                                <Control.textarea id="comment" name="comment"
                                                  className="form-control" model=".comment"
                                                  rows={6}
                                                  validators={{required}} />
                                <Errors className="text-danger" model=".comment" show="comment"
                                        messages={{
                                            required: "Required",
                                        }}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Button color="primary" type="submit">Submit</Button>
                            </FormGroup>
                        </LocalForm>
                    </ModalBody>
                </Modal>
            </React.Fragment>
        )
    }
}

function RenderDish({dish}) {
    return(
        <FadeTransform in transformProps={{exitTransform: 'scale(0.5) translateY(-50%)'}}>
            <Card>
                <CardImg top src={baseUrl + dish.image} alt={dish.name}/>
                <CardBody>
                    <CardTitle>{dish.name}</CardTitle>
                    <CardText>{dish.description}</CardText>
                </CardBody>
            </Card>
        </FadeTransform>
    );
}

function RenderCommments({comments, postComment, dishId}) {
    if(comments != null) {
        return(
            <React.Fragment>
                <h4>Comments:</h4>
                <ul className="list-unstyled">
                    <Stagger in>
                        {comments.map((comment) =>
                            <li key={comment.id}>
                                <p>{comment.comment}</p>
                                <p>-- {comment.author}, {new Intl.DateTimeFormat("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "2-digit",
                                }).format(new Date(Date.parse(comment.date)))}</p>
                            </li>
                        )}
                    </Stagger>
                </ul>
                <CommentForm dishId={dishId} postComment={postComment} />
            </React.Fragment>
        )
    } else {
        return(
            <div/>
        )
    }
    /*const renderedComments = comments.map((comment) => {
        return(
            <li key={comment.id}>
                <div>
                    <h4>Comments:</h4>
                    <p>{comment.comment}</p>
                    <p>-- {comment.author}, {new Intl.DateTimeFormat("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "2-digit",
                    }).format(new Date(Date.parse(comment.date)))}</p>
                </div>
            </li>
        )
    });

    if(comments != null) {
        return(
            <ul className="list-unstyled">
                {renderedComments}
            </ul>
        )
    } else {
        return(
            <div/>
        )
    }*/
}

const Dishdetail = (props) => {
    if(props.isLoading) {
        return (
            <div className="container">
                <div className="row">
                    <Loading />
                </div>
            </div>
        )
    }
    else if (props.errMess) {
        return(
            <div className="container">
                <div className="row">
                    <h4>{props.errMess}</h4>
                </div>
            </div>
        )
    }
    else if (props.dish != null) {
        return (
            <div className="container">
                <div className="row">
                    <Breadcrumb>
                        <BreadcrumbItem><Link to="/menu">Menu</Link></BreadcrumbItem>
                        <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
                    </Breadcrumb>
                    <div className="col-12">
                        <h3>{props.dish.name}</h3>
                        <hr />
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-md-5 m-1">
                        <RenderDish dish={props.dish}/>
                    </div>
                    <div className="col-12 col-md-5 m-1">
                        <RenderCommments comments={props.comments} postComment={props.postComment} dishId={props.dish.id}/>
                    </div>
                </div>
            </div>
        );
    } else {
        return(
            <div />
        )
    }
}

export default Dishdetail