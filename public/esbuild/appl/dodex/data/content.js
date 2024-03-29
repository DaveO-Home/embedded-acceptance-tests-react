 /* eslint no-undef: 0 */
 dodexContent = {
	cards: {
		card1: {
			tab: "A",
			front: {
				content: `<h1>Application Access</h1>
				<div class="mr-2 login-a" onclick="document.querySelector('.login').click();">
					Log in:<a href="#" class=""><i class="fa fa-sign-in-alt"></i></a>
            	</div>`
			},
			back: {
				content: ""
			}
		},
		card2: {
			tab: "B",
			front: {
				"content": ""
			},
			back: {
				content: ""
			}
		},
		card3: {
			tab: "C",
			front: {
				content: `<h1>Best's Contact Form</h1>
					<a ng-reflect-router-link="/contact" href="#contact"><i class="fa fa-phone"></i>Contact</a>`
			},
			back: {
				content: "<h1>Lorem Ipsum</h1><a href=\"https://www.yahoo.com\" target=\"_\">Yahoo</a>"
			}
		},
		card4: {
			tab: "D",
			front: {
				content: ""
			},
			back: {
				content: ""
			}
		},
		card5: {
			tab: "E",
			front: {
				content: ""
			},
			back: {
				content: ""
			}
		},
		card6: {
			tab: "F",
			front: {
				content: ""
			},
			back: {
				content: ""
			}
		},
		"card16": {
			tab: "P",
			front: {
				content: "<h1>Test Pdf</h1><a ng-reflect-router-link=\"/pdf/test\" href=\"#pdf/test\"><i class=\"far fa-fw fa-file-pdf\"></i>PDF View</a>"
			},
			back: {
				content: "<h1>Lorem Ipsum</h1><a href=\"https://www.yahoo.com\" target=\"_\">Yahoo16</a>"
			}
		},
		card20: {
			tab: "T",
			front: {
				content: "<h1>Test Table</h1><a ng-reflect-router-link=\"/table/tools\" href=\"#table/tools\"><i class=\"fa fa-fw fa-table\"></i>Table View</a>"
			},
			back: {
				content: "<h1>Lorem Ipsum</h1><a href=\"https://www.yahoo.com\" target=\"_\">Yahoo20</a>"
			}
		},
		card8: {
			tab: "H",
			front: {
				content: `<h1>Description</h1>
				<a ng-reflect-router-link="/" href="#/">
					<i class="fa fa-fw fa-home"></i>Home
						<span class="sr-only">(current)</span>
				</a>`
				// <a href=\"#!\"><i class=\"fa fa-fw fa-home\"></i>Home</a>`
			},
			back: {
				content: "<h1>Lorem Ipsum</h1><a href=\"https://www.yahoo.com\" target=\"_\">Yahoo8</a>"
			}
		},
		"card23": {
			tab: "W",
			front: {
				content: "<h1>Angular Welcome</h1><a ng-reflect-router-link=\"/welcome\" href=\"#/welcome\"><i class=\"far fa-fw fa-hand-paper\"></i>Welcome</a>"
			},
			back: {
				content: ""
			}
		},
		card27: {
			tab: "",
			front: {
				content: ""
			},
			back: { // Bootstrap 
				content: `<h1 style="font-size: 14px;">
					<svg height="18" width="17" style="font-family: 'Open Sans', sans-serif;">
					<text x="3" y="18" fill="#059">O</text><text x="0" y="15" fill="#059">D</text></svg> doDex</h1>
					<footer class="dodex-footer  mt-auto py-3" style="width:350px">
					<div class="container">
						<div class="row">
							<div class="footer-col col-sm-6">
								<ul class="list-inline" style="width:345px;">
									<li class="list-inline-item"><a class="btn-social btn-outline" href="https://www.facebook.com/" target="_"><i class="fab fa-fw fa-facebook"></i></a></li>
									<li class="list-inline-item"><a class="btn-social btn-outline" href="https://news.google.com/" target="_"><i class="fab fa-fw fa-google"></i></a></li>
									<li class="list-inline-item"><a class="btn-social btn-outline" href="https://twitter.com/Twitter" target="_"><i class="fab fa-fw fa-twitter"></i></a></li>
									<li class="list-inline-item"><a class="btn-social btn-outline" href="https://www.linkedin.com/" target="_"><i class="fab fa-fw fa-linkedin"></i></a></li>
									<li class="list-inline-item"><a class="btn-social btn-outline" href="https://dribbble.com/" target="_"><i class="fab fa-fw fa-dribbble"></i></a></li>
									<li class="list-inline-item float-end">doDex &copy; 2021</li>
								</ul>
							</div>
						</div>
					</div></footer>`
			}
		}
	}
};