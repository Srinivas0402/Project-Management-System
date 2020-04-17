  
var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    flash       = require("connect-flash"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    project		= require("./models/project"),
    comment		= require("./models/comment"),
    User		= require("./models/user");

app.set('port',(process.env.PORT || 3000));
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static("public"));
mongoose.connect("mongodb://localhost/projectss");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//express-session
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
//passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//==================
// Sets to users
//==================
var faculty =new Set(["BMSCS03","BMSCS04","BMSCS05","BMSCS06","BMSCS07"]);
var pc= new Set(["BMSCS01","BMSCS02","BMSCS00"]);


app.use(function(req,res,next){
 res.locals.currentUser=req.user;

 next();
});


//============
//Routes
//============

app.get("/",function(req,res){
   res.render("home.ejs",{req:req.user});

});
//register routes
app.get("/register",function(req,res){
	res.render("register",{req:req.user});
});

app.post("/register",function(req,res){
   if(faculty.has(req.body.empid) || pc.has(req.body.empid)){
	 var newUser = new User({empid:req.body.empid,username: req.body.username});
       User.register(newUser, req.body.password, function(err, user){
      passport.authenticate("local")(req, res, function(){
        console.log("mam")
           res.redirect('/projects'); 
        });
    });
   }else{
    res.redirect("/register");
   }
});


//=========
//login routes
//========
app.get("/login",function(req,res){
	res.render("login",{req:req.user});
});

app.post("/login", passport.authenticate("local", 
    {

        successRedirect: "/projects",
        failureRedirect: "/login"
    }), function(req, res){
});

//============
//project routes
//============
app.get("/projects",isLoggedIn,function(req,res){
	if(faculty.has(req.user.empid)){
    
	a(req,res,app);
}
if(pc.has(req.user.empid)){
	project.find({},function(err,projects){
		if(err){
			console.log(err);
		}else{
            res.render("pcproject",{project:projects,req:req.user});
		}
	});
}
});

app.get("/mentoring",isLoggedIn,function(req,res){
   
     res.render("mentor",{req:req.user});

});


app.get("/mentoring/projects/new",isLoggedIn,function(req,res){
   res.render("newp",{req:req.user});
});
app.post("/mentoring/projects",isLoggedIn,function(req,res){
   var newproject={
    title:req.body.title,
    briefdesc:req.body.briefdesc,
    compdesc: req.body.compdesc,
    student:req.body.student,
    author:{
        id:req.user._id,
        username:req.user.username
    }
   }
   project.create(newproject,function(err,newprojects){
    if(err){
        
        res.redirect("/mentoring/projects/new");
    }else{
        res.redirect("/mentoring");
    }
   });
});


app.get("/mentoring/:id",isLoggedIn,function(req,res){
    var sm={id:req.user._id,
        username:req.user.username};
    project.find({author:sm},function(err,prj){
        if(err){
            console.log(err);
        }else{
            res.render("myprojects",{project:prj,req:req.user});
        }
    });
  
});
app.get("/project/:id",isLoggedIn,function(req,res){
   project.findById(req.params.id).populate("comments").exec(function(err, foundprojects){
      if(err){
       console.log(err);
      }else{
        res.render("show",{projects:foundprojects,req:req.user,id:req.params.id,pc:pc});
      }
   });
});

app.get("/project/:id/comment/new",isLoggedIn,function(req,res){
   res.render("newcomment",{id:req.params.id});
});



app.post("/project/:id/comment",isLoggedIn,function(req,res){
    
  project.findById(req.params.id,function(err,project){
    if(err){
        res.redirect("/project"+req.params.id);
    }else{
        var newcomment={
            text:req.body.text,
            author:{
                id :req.user._id,
                username:req.user.username}
        }
         
        comment.create(newcomment, function(err, comment){
           
           if(err){
              
               console.log(err);
           } else {
           
               //add username and id to comment
               comment.author.id = req.user._id;
               comment.author.username = req.user.username;
               //save comment
               comment.save();
               project.comments.push(comment);
               project.save();
               res.redirect('/project/' + project._id);
         }
        });
       }
   });
});


app.get("/logout",isLoggedIn,function(req,res){
    req.logout();
    res.redirect("/");
});

app.get("/Plist",function(req,res){
    project.find({},function(err,project){
        if(err){
            res.redirect("/");
        }else{
            res.render("projectList",{project:project});
        }
    });
   
});

app.get("/project/:id/Edit",isLoggedIn,function(req,res){
 project.findById(req.params.id,function(err,project){
      if(err){
        res.redirect("/project/"+req.params.id);
      }else{
        res.render("Editform",{project:project,id:req.params.id});
      }
 });

});

app.put("/project/:id/Edit",isLoggedIn,function(req,res){
    project.findByIdAndUpdate(req.params.id,req.body.project,function(err,project){
        if(err){
            res.redirect("/project/"+req.params.id);
        }else{
            res.redirect("/project/"+req.params.id);
        }

    });


});


function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
     
        return next();
    }
    res.redirect("/login");
}

function a(req,res,app){
project.find({},function(err,projects){
    if(err){
      console.log(err);
    }else{
            res.render("fproject",{project:projects,req:req.user});
    }
  });
}




app.listen(app.get('port'),function(req,res){
console.log("server has just started");
});