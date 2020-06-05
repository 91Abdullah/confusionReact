
import React, { Component } from "react";
import Menu from './MenuComponent';
import Dishdetail  from './DishdetailComponent';
import Header from "./HeaderComponent";
import Footer from "./FooterComponent";
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import Home from "./HomeComponent";
import Contact from "./ContactComponent";
import About from "./AboutComponent";
import {connect} from "react-redux";
import {
    addComment,
    fetchDishes,
    fetchComments,
    fetchPromos,
    postComment,
    fetchLeaders,
    postFeedback
} from "../redux/ActionCreators";
import {actions} from "react-redux-form";
import { CSSTransition, TransitionGroup } from "react-transition-group";

const mapStateToProps = state => {
    console.log(state);
    return {
        dishes: state.dishes,
        comments: state.comments,
        promotions: state.promotions,
        leaders: state.leaders
    }
}

const mapDispatchToProps = dispatch => ({
    addComment: (dishId, rating, author, comment) => dispatch(addComment(dishId, rating, author, comment)),
    postComment: (dishId, rating, author, comment) => dispatch(postComment(dishId, rating, author, comment)),
    fetchDishes: () => { dispatch(fetchDishes()) },
    fetchPromos: () => {
        dispatch(fetchPromos());
    },
    fetchComments: () => {
        dispatch(fetchComments())
    },
    fetchLeaders: () => {
        dispatch(fetchLeaders())
    },
    postFeedback: (feedback) => { dispatch(postFeedback(feedback)) },
    resetFeedbackForm: () => { dispatch(actions.reset('feedback')) }
})

class Main extends Component {

    componentDidMount() {
        this.props.fetchDishes();
        this.props.fetchComments();
        this.props.fetchPromos();
        this.props.fetchLeaders();
    }

    constructor(props) {
        super(props);
    }

    render() {

        const HomePage = () => {
            return(
                <Home
                    dish={this.props.dishes.dishes.filter((dish) => dish.featured)[0]}
                    dishesLoading={this.props.dishes.isLoading}
                    dishesErrMess={this.props.dishes.errMess}
                    promotion={this.props.promotions.promotions.filter((promotion) => promotion.featured)[0]}
                    promosLoading={this.props.promotions.isLoading}
                    promosErrMess={this.props.promotions.errMess}
                    leader={this.props.leaders.leaders.filter((leader) => leader.featured)[0]}
                    leaderLoading={this.props.leaders.isLoading}
                    leaderErrMess={this.props.leaders.errMess}
                />
            );
        }

        const DishWithId = ({match}) => {
            return(
                <Dishdetail dish={this.props.dishes.dishes.filter((dish) => dish.id === parseInt(match.params.dishId))[0]}
                    comments={this.props.comments.comments.filter((comment) => comment.dishId === parseInt(match.params.dishId))}
                    addComment={this.props.addComment}
                    postComment={this.props.postComment}
                    commentsErrMess={this.props.comments.errMess}
                    isLoading={this.props.dishes.isLoading}
                    errMess={this.props.dishes.errMess}
                />
            )
        }

        return(
            <div>
                <Header/>
                <TransitionGroup>
                    <CSSTransition key={this.props.location.key} classNames="page" timeout={300}>
                        <Switch location={this.props.location}>
                            <Route path="/home" component={HomePage}/>
                            <Route exact path="/menu" component={() => <Menu dishes={this.props.dishes} />}/>
                            <Route exact path="/contactus" component={() => <Contact postFeedback={this.props.postFeedback} resetFeedbackForm={this.props.resetFeedbackForm} /> } />
                            <Route exact path="/aboutus" component={() => <About leaders={this.props.leaders} />} />
                            <Route path="/menu/:dishId" component={DishWithId} />
                            <Redirect to="/home"/>
                        </Switch>
                    </CSSTransition>
                </TransitionGroup>
                <Footer/>
            </div>
        );
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));